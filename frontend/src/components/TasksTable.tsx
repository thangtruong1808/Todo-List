/**
 * TasksTable Component
 * 
 * Description: Responsive table component to display all tasks with pagination, row selection, and sorting.
 *              Includes functionality to control the number of rows displayed per page.
 *              Displays all task fields: id, title, description, status, taskcode, due_date, created_at, updated_at.
 *              Supports sorting by clicking on column headers with ASC/DESC functionality and visual indicators.
 *              Includes delete and edit functionality with toast notifications for success and error states.
 *              Edit button triggers onEditTask callback to populate CreateTaskForm with task data.
 *              Uses responsive design to avoid horizontal scrolling by hiding less critical columns on smaller screens
 *              and using compact spacing and shorter date formats.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Task } from '../types';
import { getAllTasks, deleteTask } from '../services/taskService';
import {
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileAlt,
  FaAlignLeft,
  FaFlag,
  FaCalendarAlt,
  FaCalendarPlus,
  FaSyncAlt,
  FaExclamationTriangle,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';

interface TasksTableProps {
  refreshKey?: number;
  onEditTask?: (task: Task) => void;
}

const TasksTable = ({ refreshKey = 0, onEditTask }: TasksTableProps) => {
  // State for tasks data
  const [tasks, setTasks] = useState<Task[]>([]);
  // State for loading
  const [loading, setLoading] = useState<boolean>(true);
  // State for error
  const [error, setError] = useState<string | null>(null);
  // State for current page
  const [currentPage, setCurrentPage] = useState<number>(1);
  // State for rows per page
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  // State for sort field
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  // State for sort direction
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  // State for task to delete
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  // State for deleting
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Row per page options - available pagination sizes
  const rowsPerPageOptions = [5, 10, 20, 50, 100];

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

  // Fetch tasks on component mount and when refreshKey changes
  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

  // Handle sort
  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Sort tasks
  const sortedTasks = useMemo(() => {
    if (!sortField) return tasks;

    return [...tasks].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle date fields (due_date, created_at, updated_at)
      if (sortField === 'due_date' || sortField === 'created_at' || sortField === 'updated_at') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        if (!isNaN(aDate) && !isNaN(bDate)) {
          return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
        return 0;
      }

      // Handle number fields (id)
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string fields (title, description, status, taskcode)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      return 0;
    });
  }, [tasks, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedTasks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTasks = useMemo(() => {
    return sortedTasks.slice(startIndex, endIndex);
  }, [sortedTasks, startIndex, endIndex]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  // Handle delete task button click
  const handleDeleteTask = (id: number) => {
    // Find task before deleting to show in modal
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteModal(true);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!taskToDelete || !taskToDelete.id) return;

    try {
      setIsDeleting(true);
      await deleteTask(taskToDelete.id);
      fetchTasks(); // Refresh the table
      setShowDeleteModal(false);
      setTaskToDelete(null);
      toast.success(`Task has been successfully deleted. ID=${taskToDelete.id}, Title="${taskToDelete.title}"`, {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete task. Please try again.', {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // Handle edit task
  const handleEditTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task && onEditTask) {
      onEditTask(task);
    }
  };

  // Format date for display (full format)
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date for display (short format for mobile)
  const formatDateShort = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">List View: All Tasks</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="rowsPerPage" className="text-sm font-medium text-gray-700">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No tasks found. Create your first task above!</p>
        </div>
      ) : (
        <>
          {/* Table - Responsive Design */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      {sortField === 'id' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('taskcode')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Code</span>
                      {sortField === 'taskcode' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 min-w-[200px]"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-1">
                      <FaFileAlt className="text-gray-500" />
                      <span>Title</span>
                      {sortField === 'title' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell min-w-[300px] cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center space-x-1">
                      <FaAlignLeft className="text-gray-500" />
                      <span>Description</span>
                      {sortField === 'description' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <FaFlag className="text-gray-500" />
                      <span>Status</span>
                      {sortField === 'status' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('due_date')}
                  >
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="text-gray-500" />
                      <span>Due Date</span>
                      {sortField === 'due_date' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center space-x-1">
                      <FaCalendarPlus className="text-gray-500" />
                      <span>Created</span>
                      {sortField === 'created_at' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleSort('updated_at')}
                  >
                    <div className="flex items-center space-x-1">
                      <FaSyncAlt className="text-gray-500" />
                      <span>Updated</span>
                      {sortField === 'updated_at' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="text-gray-600" />
                        ) : (
                          <FaSortDown className="text-gray-600" />
                        )
                      ) : (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                      {task.id}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                      {task.taskcode}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 max-w-[200px] truncate" title={task.title}>
                      {task.title}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-600 max-w-[300px] truncate hidden lg:table-cell" title={task.description || 'N/A'}>
                      {task.description || 'N/A'}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-600">
                      <span className="hidden md:inline">{formatDate(task.due_date)}</span>
                      <span className="md:hidden">{formatDateShort(task.due_date)}</span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-600 hidden xl:table-cell">
                      {formatDateShort(task.created_at)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-600 hidden xl:table-cell">
                      {formatDateShort(task.updated_at)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditTask(task.id!)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center space-x-1"
                          title="Edit task"
                        >
                          <FaEdit className="text-xs" />
                          <span className="hidden md:inline text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id!)}
                          className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 flex items-center space-x-1"
                          title="Delete task"
                        >
                          <FaTrash className="text-xs" />
                          <span className="hidden md:inline text-xs">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, sortedTasks.length)} of {sortedTasks.length}{' '}
                tasks
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {(() => {
                    const pages: (number | string)[] = [];
                    const showPages = 5; // Number of page buttons to show

                    if (totalPages <= showPages) {
                      // Show all pages if total pages is less than or equal to showPages
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Always show first page
                      pages.push(1);

                      if (currentPage > 3) {
                        pages.push('ellipsis-start');
                      }

                      // Show pages around current page
                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);

                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push('ellipsis-end');
                      }

                      // Always show last page
                      pages.push(totalPages);
                    }

                    return pages.map((page, index) => {
                      if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page as number)}
                          className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
                </div>
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
                <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">ID:</span>
                      <span className="ml-2 text-sm text-gray-800">{taskToDelete.id}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Title:</span>
                      <span className="ml-2 text-sm text-gray-800">{taskToDelete.title}</span>
                    </div>
                    {taskToDelete.description && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Description:</span>
                        <p className="ml-2 text-sm text-gray-800 mt-1">{taskToDelete.description}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(taskToDelete.status)}`}>
                        {taskToDelete.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Task Code:</span>
                      <span className="ml-2 text-sm text-gray-800">{taskToDelete.taskcode}</span>
                    </div>
                    {taskToDelete.due_date && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Due Date:</span>
                        <span className="ml-2 text-sm text-gray-800">{formatDate(taskToDelete.due_date)}</span>
                      </div>
                    )}
                    {taskToDelete.created_at && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Created At:</span>
                        <span className="ml-2 text-sm text-gray-800">{formatDate(taskToDelete.created_at)}</span>
                      </div>
                    )}
                    {taskToDelete.updated_at && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Updated At:</span>
                        <span className="ml-2 text-sm text-gray-800">{formatDate(taskToDelete.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTable;

