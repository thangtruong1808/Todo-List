/**
 * Description: Drag-and-drop Kanban board syncing tasks by status columns.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import { Task, TaskStatus } from '../../types';
import { getAllTasks, updateTask } from '../../services/taskService';
import { getMelbourneTime, normalizeToMelbourneIso } from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import KanbanBoardLoading from './KanbanBoardLoading';

const statusColumns: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue']; // Column ordering for board lanes
const columnNames: Record<TaskStatus, string> = { // Display labels for column headers
  'Pending': 'Pending',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
  'Archived': 'Archived',
  'Overdue': 'Overdue',
};
const toastOptions = { // Shared toast configuration for board actions
  position: 'bottom-left' as const,
  autoClose: 7000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};
const isClosedStatus = (status: TaskStatus) => status === 'Completed' || status === 'Archived'; // Flags finished tasks
const isActiveStatus = (status: TaskStatus) => status === 'Pending' || status === 'In Progress'; // Flags work-in-progress tasks

const hasDueDatePassed = (task: Task): boolean => { // Confirms whether task due date has elapsed
  const normalized = normalizeToMelbourneIso(task.due_date);
  if (!normalized) {
    return false;
  }
  const dueDate = new Date(normalized);
  return !Number.isNaN(dueDate.getTime()) && dueDate.getTime() < getMelbourneTime().getTime();
};

interface KanbanBoardProps {
  selectedStatuses?: TaskStatus[];
}

const KanbanBoard = ({ selectedStatuses = statusColumns }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>([]); // All tasks available to render
  const [loading, setLoading] = useState<boolean>(true); // Loading state for initial fetch
  const [error, setError] = useState<string | null>(null); // Error text for fetch failures
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Task selected for modal viewing

  const fetchTasks = useCallback(async () => { // Pull tasks from backend service
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

  useEffect(() => { // Bootstrap tasks when component mounts
    fetchTasks();
  }, [fetchTasks]);

  const tasksByStatus = useMemo(() => { // Group tasks by status for quicker lookups
    return statusColumns.reduce((acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  const statusPercentages = useMemo(() => { // Calculate status distribution for header percentages
    const totalTasks = tasks.length || 1;
    return statusColumns.reduce((acc, status) => {
      acc[status] = (tasksByStatus[status]?.length ?? 0) / totalTasks * 100;
      return acc;
    }, {} as Record<TaskStatus, number>);
  }, [tasks.length, tasksByStatus]);

  const handleDragEnd = useCallback(async (result: DropResult) => { // React DnD completion handler
    // Ignore drops without meaningful moves
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    // Resolve dragged task from id
    const taskId = parseInt(draggableId, 10);
    if (isNaN(taskId)) {
      return;
    }
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.id) {
      return;
    }
    // Determine new status bucket
    const newStatus = destination.droppableId as TaskStatus;
    if (task.status === newStatus) {
      return;
    }
    // Guard rails for overdue transitions
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
    const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)); // Apply optimistic update
    setTasks(updatedTasks);
    try {
      await updateTask(task.id, { status: newStatus }); // Persist change to backend
      toast.success(`Task ID=${task.id} "${task.title}" status updated to ${newStatus}`, toastOptions);
    } catch (error: unknown) {
      setTasks(tasks); // Revert optimistic change
      toast.error(getErrorMessage(error, 'Failed to update task status. Please try again.'), toastOptions);
    }
  }, [tasks]);

  const handleTaskClick = (task: Task) => { // Capture the task user clicked for detail view
    setSelectedTask(task);
  };
  const handleCloseModal = () => { // Close the task detail modal
    setSelectedTask(null);
  };

  if (loading) {
    return <KanbanBoardLoading />; // Loading placeholder
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Error fallback */}
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          {/* Retry fetching tasks */}
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
      {/* Drag and drop context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Visible status columns */}
          {statusColumns.map((status) => {
            if (!selectedStatuses.includes(status)) {
              return null;
            }
            const allColumnTasks = tasksByStatus[status] ?? [];
            const statusPercentage = statusPercentages[status] ?? 0;
            return (
              <div key={status} className="flex flex-col">
                {/* Column header */}
                <div className="bg-gray-100 rounded-t-lg p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {columnNames[status]} <span className="text-xs text-gray-600">({allColumnTasks.length})</span> <span className="text-xs text-gray-500">- {statusPercentage.toFixed(2)}%</span>
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
                      {/* Column tasks */}
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
      {/* Task detail modal */}
      <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
    </div>
  );
};

export default KanbanBoard;

