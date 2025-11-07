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
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  // State for loading
  const [loading, setLoading] = useState<boolean>(true);
  // State for error
  const [error, setError] = useState<string | null>(null);
  // State for selected task in modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fetch tasks from API
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

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Get tasks for a specific status column
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  // Get total number of tasks
  const getTotalTasks = (): number => {
    return tasks.length;
  };

  // Get percentage of tasks for a specific status
  const getStatusPercentage = (status: TaskStatus): number => {
    const totalTasks = getTotalTasks();
    if (totalTasks === 0) return 0;
    const statusTasks = getTasksByStatus(status);
    return (statusTasks.length / totalTasks) * 100;
  };

  // Handle drag end - memoized to prevent re-initialization
  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Get the task being dragged - find by ID from draggableId
    const taskId = parseInt(draggableId, 10);
    if (isNaN(taskId)) {
      return;
    }

    // Find task by ID
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.id) {
      return;
    }

    // Get the new status from destination column
    const newStatus = destination.droppableId as TaskStatus;

    // If status hasn't changed, don't update
    if (task.status === newStatus) {
      return;
    }

    // Optimistically update the UI
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    // Update task status via API
    try {
      await updateTask(task.id, { status: newStatus });
      toast.success(`Task "${task.title}" status updated to ${newStatus}`, {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Notify parent component of update
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error: unknown) {
      // Revert optimistic update on error
      setTasks(tasks);
      toast.error(getErrorMessage(error, 'Failed to update task status. Please try again.'), {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [tasks, onTaskUpdate]);

  // Handle task card click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Handle modal close
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
            // Skip column if status is not in selected statuses
            if (!selectedStatuses.includes(status)) {
              return null;
            }
            const allColumnTasks = getTasksByStatus(status);

            return (
              <div key={status} className="flex flex-col">
                {/* Column Header */}
                <div className="bg-gray-100 rounded-t-lg p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {columnNames[status]} <span className="text-xs text-gray-600">({allColumnTasks.length})</span> <span className="text-xs text-gray-500">- {getStatusPercentage(status).toFixed(2)}%</span>
                    </h3>
                  </div>
                </div>

                {/* Droppable Column */}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[200px] max-h-[900px] p-3 rounded-b-lg transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                        style={{ overflowY: 'auto' }}
                      >
                        {allColumnTasks.map((task, index) => {
                          // Ensure draggableId is always a valid string
                          const draggableId = task.id ? task.id.toString() : `task-${index}-${status}`;
                          return (
                            <Draggable
                              key={draggableId}
                              draggableId={draggableId}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    marginBottom: '12px',
                                  }}
                                  className={`${snapshot.isDragging ? 'opacity-50' : 'opacity-100'
                                    }`}
                                >
                                  <TaskCard task={task} onClick={() => handleTaskClick(task)} />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Task Detail Modal */}
      <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
    </div>
  );
};

export default KanbanBoard;

