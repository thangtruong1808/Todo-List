/**
 * KanbanBoard Component
 *
 * Description: Kanban board component with drag-and-drop functionality.
 *              Displays tasks in columns based on their status.
 *              Allows users to drag tasks between columns to update status.
 *              Uses vertical scrolling to display all tasks in each column.
 *
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import { Task, TaskStatus } from '../../types';
import { getAllTasks, updateTask } from '../../services/taskService';
import { getMelbourneTime, normalizeToMelbourneIso } from '../../utils/dateUtils';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';

// Status columns configuration - order of columns in Kanban board
const statusColumns: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue'];
// Column display names - mapping of status to display name
const columnNames: Record<TaskStatus, string> = {
  'Pending': 'Pending',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
  'Archived': 'Archived',
  'Overdue': 'Overdue',
};
// Toast configuration for consistent notifications
const toastOptions = {
  position: 'bottom-left' as const,
  autoClose: 7000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};
// Closed statuses that should not move into Overdue directly
const isClosedStatus = (status: TaskStatus) => status === 'Completed' || status === 'Archived';
const isActiveStatus = (status: TaskStatus) => status === 'Pending' || status === 'In Progress';
const hasDueDatePassed = (task: Task): boolean => {
  const normalized = normalizeToMelbourneIso(task.due_date);
  if (!normalized) {
    return false;
  }
  const dueDate = new Date(normalized);
  return !Number.isNaN(dueDate.getTime()) && dueDate.getTime() < getMelbourneTime().getTime();
};

interface KanbanBoardProps {
  onTaskUpdate?: () => void;
  selectedStatuses?: TaskStatus[];
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError<{ error?: string }>(error)) {
    const serverMessage = error.response?.data?.error;
    return serverMessage ?? error.message ?? fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

const KanbanBoard = ({ onTaskUpdate, selectedStatuses = statusColumns }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to fetch tasks. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTasksByStatus = (status: TaskStatus): Task[] => tasks.filter((task) => task.status === status);
  const getStatusPercentage = (status: TaskStatus): number => {
    if (tasks.length === 0) return 0;
    const statusTasks = getTasksByStatus(status);
    return (statusTasks.length / tasks.length) * 100;
  };

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    const taskId = parseInt(draggableId, 10);
    if (isNaN(taskId)) {
      return;
    }
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.id) {
      return;
    }
    const newStatus = destination.droppableId as TaskStatus;
    if (task.status === newStatus) {
      return;
    }
    if (newStatus === 'Overdue') {
      if (isClosedStatus(task.status)) {
        toast.error('Completed or archived tasks cannot be moved to Overdue. Please reopen the task first.', toastOptions);
        return;
      }
      if (isActiveStatus(task.status) && !hasDueDatePassed(task)) {
        toast.error('This task is not overdue yet. Update the due date or wait until it passes before moving it to Overdue.', toastOptions);
        return;
      }
    }
    if (isClosedStatus(task.status) && isActiveStatus(newStatus) && hasDueDatePassed(task)) {
      toast.warn('Update the task due date before reopening it to Pending or In Progress.', toastOptions);
      return;
    }
    if (task.status === 'Overdue' && isActiveStatus(newStatus) && hasDueDatePassed(task)) {
      toast.warn('Update the task due date before returning it to Pending or In Progress.', toastOptions);
      return;
    }
    const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t));
    setTasks(updatedTasks);
    try {
      await updateTask(task.id, { status: newStatus });
      toast.success(`Task "${task.title}" status updated to ${newStatus}`, toastOptions);
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: unknown) {
      setTasks(tasks);
      toast.error(getErrorMessage(error, 'Failed to update task status. Please try again.'), toastOptions);
    }
  }, [tasks, onTaskUpdate]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };
  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" key={`kanban-${tasks.length}-${selectedStatuses.join(',')}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statusColumns.map((status) => {
            if (!selectedStatuses.includes(status)) {
              return null;
            }
            const allColumnTasks = getTasksByStatus(status);
            return (
              <div key={status} className="flex flex-col">
                <div className="bg-gray-100 rounded-t-lg p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {columnNames[status]} <span className="text-xs text-gray-600">({allColumnTasks.length})</span> <span className="text-xs text-gray-500">- {getStatusPercentage(status).toFixed(2)}%</span>
                    </h3>
                  </div>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[200px] max-h-[900px] p-3 rounded-b-lg transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'}`}
                      style={{ overflowY: 'auto' }}
                    >
                      {allColumnTasks.map((task, index) => {
                        const draggableId = task.id ? task.id.toString() : `task-${index}-${status}`;
                        return (
                          <Draggable key={draggableId} draggableId={draggableId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  marginBottom: '12px',
                                }}
                                className={`${snapshot.isDragging ? 'opacity-50' : 'opacity-100'}`}
                              >
                                <TaskCard task={task} onClick={() => handleTaskClick(task)} />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
    </div>
  );
};

export default KanbanBoard;

