/**
 * KanbanBoard Component
 *
 * Description: Kanban board component with drag-and-drop functionality.
 *              Displays tasks in columns based on their status.
 *              Allows users to drag tasks between columns to update status.
 *              Includes pagination to display 3 rows of cards per column.
 *
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { Task, TaskStatus } from '../../types';
import { getAllTasks, updateTask } from '../../services/taskService';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Status columns configuration
const statusColumns: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue'];

// Column display names
const columnNames: Record<TaskStatus, string> = {
  'Pending': 'Pending',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
  'Archived': 'Archived',
  'Overdue': 'Overdue',
};

// Cards per page (3 rows)
const CARDS_PER_PAGE = 3;

interface KanbanBoardProps {
  onTaskUpdate?: () => void;
  selectedStatuses?: TaskStatus[];
}

const KanbanBoard = ({ onTaskUpdate, selectedStatuses = statusColumns }: KanbanBoardProps) => {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  // State for loading
  const [loading, setLoading] = useState<boolean>(true);
  // State for error
  const [error, setError] = useState<string | null>(null);
  // State for selected task in modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // State for pagination per column
  const [currentPages, setCurrentPages] = useState<Record<TaskStatus, number>>({
    'Pending': 1,
    'In Progress': 1,
    'Completed': 1,
    'Archived': 1,
    'Overdue': 1,
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

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

  // Get paginated tasks for a specific status column
  const getPaginatedTasks = (status: TaskStatus): Task[] => {
    const allTasks = getTasksByStatus(status);
    const currentPage = currentPages[status];
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return allTasks.slice(startIndex, endIndex);
  };

  // Get total pages for a specific status column
  const getTotalPages = (status: TaskStatus): number => {
    const allTasks = getTasksByStatus(status);
    return Math.ceil(allTasks.length / CARDS_PER_PAGE);
  };

  // Handle page change for a specific column
  const handlePageChange = (status: TaskStatus, page: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [status]: page,
    }));
  };

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Get the task being dragged from the source column's full list
    const sourceStatus = source.droppableId as TaskStatus;
    const sourceTasks = getTasksByStatus(sourceStatus);
    const task = sourceTasks[source.index];
    
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

    // Reset pagination for affected columns
    setCurrentPages((prev) => ({
      ...prev,
      [sourceStatus]: 1,
      [newStatus]: 1,
    }));

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
    } catch (error: any) {
      // Revert optimistic update on error
      setTasks(tasks);
      toast.error(error.response?.data?.error || 'Failed to update task status. Please try again.', {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

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
    <div className="w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statusColumns.map((status) => {
            // Skip column if status is not in selected statuses
            if (!selectedStatuses.includes(status)) {
              return null;
            }
            const allColumnTasks = getTasksByStatus(status);
            const paginatedTasks = getPaginatedTasks(status);
            const totalPages = getTotalPages(status);
            const currentPage = currentPages[status];

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
                    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
                    const endIndex = startIndex + CARDS_PER_PAGE;
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[200px] max-h-[600px] p-3 rounded-b-lg transition-colors duration-200 ${
                          snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                        }`}
                        style={{ overflowY: 'auto' }}
                      >
                        {allColumnTasks.map((task, index) => {
                          // Check if this task should be visible (on current page)
                          const isVisible = index >= startIndex && index < endIndex;
                          return (
                            <Draggable
                              key={task.id?.toString()}
                              draggableId={task.id?.toString() || ''}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    marginBottom: isVisible ? '12px' : '0',
                                    display: isVisible ? 'block' : 'none',
                                  }}
                                  className={`${
                                    snapshot.isDragging ? 'opacity-50' : 'opacity-100'
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-100 rounded-b-lg p-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handlePageChange(status, currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                      >
                        <FaChevronLeft className="text-xs" />
                      </button>
                      <span className="text-xs text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(status, currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                      >
                        <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}
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

