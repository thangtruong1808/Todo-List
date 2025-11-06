/**
 * TaskDetailModal Component
 *
 * Description: Modal component for displaying full task details.
 *              Shows all task information including ID, title, description,
 *              status, task code, due date, and timestamps.
 *
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Task } from '../../types';
import { FaTimes, FaBarcode, FaFileAlt, FaAlignLeft, FaFlag, FaCalendarAlt, FaCalendarPlus, FaSyncAlt } from 'react-icons/fa';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  if (!task) return null;

  // Format date for display
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Task Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="space-y-4">
            {/* ID */}
            <div>
              <span className="text-sm font-medium text-gray-600">ID:</span>
              <span className="ml-2 text-sm text-gray-800">{task.id}</span>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaFileAlt className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Title:</span>
              </div>
              <p className="text-sm text-gray-800 ml-6">{task.title}</p>
            </div>

            {/* Task Code */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaBarcode className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Task Code:</span>
              </div>
              <p className="text-sm text-gray-800 font-mono ml-6">{task.taskcode}</p>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaAlignLeft className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Description:</span>
              </div>
              <p className="text-sm text-gray-800 ml-6 whitespace-pre-wrap">
                {task.description || 'N/A'}
              </p>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaFlag className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Status:</span>
              </div>
              <div className="ml-6">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Due Date:</span>
              </div>
              <p className="text-sm text-gray-800 ml-6">{formatDate(task.due_date)}</p>
            </div>

            {/* Created At */}
            {task.created_at && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaCalendarPlus className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Created At:</span>
                </div>
                <p className="text-sm text-gray-800 ml-6">{formatDate(task.created_at)}</p>
              </div>
            )}

            {/* Updated At */}
            {task.updated_at && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaSyncAlt className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Updated At:</span>
                </div>
                <p className="text-sm text-gray-800 ml-6">{formatDate(task.updated_at)}</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

