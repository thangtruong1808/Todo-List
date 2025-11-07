/**
 * DeleteTaskModal Component
 *
 * Description: Confirmation modal for deleting a task, displaying a task summary,
 *              status badge, and action buttons while supporting a loading state.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

import { FaExclamationTriangle, FaSpinner, FaTimes, FaTrash } from 'react-icons/fa';
import { Task } from '../../types';
import { formatTaskDate, getStatusBadgeColor } from './utils';

interface DeleteTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteTaskModal = ({
  task,
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteTaskModalProps) => {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
            </div>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <span className="ml-2 text-sm text-gray-800">{task.id}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Title:</span>
                  <span className="ml-2 text-sm text-gray-800">{task.title}</span>
                </div>
                {task.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <p className="ml-2 text-sm text-gray-800 mt-1">{task.description}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Task Code:</span>
                  <span className="ml-2 text-sm text-gray-800">{task.taskcode}</span>
                </div>
                {task.due_date && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Due Date:</span>
                    <span className="ml-2 text-sm text-gray-800">{formatTaskDate(task.due_date)}</span>
                  </div>
                )}
                {task.created_at && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Created At:</span>
                    <span className="ml-2 text-sm text-gray-800">{formatTaskDate(task.created_at)}</span>
                  </div>
                )}
                {task.updated_at && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Updated At:</span>
                    <span className="ml-2 text-sm text-gray-800">{formatTaskDate(task.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
            <button
              onClick={onConfirm}
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
  );
};

export default DeleteTaskModal;

