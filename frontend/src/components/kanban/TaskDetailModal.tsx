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
import { FaTimesCircle, FaBarcode, FaFileAlt, FaAlignLeft, FaFlag, FaCalendarAlt, FaCalendarPlus, FaSyncAlt } from 'react-icons/fa';
import { formatDateTimeInMelbourne } from '../../utils/dateUtils';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  if (!task) return null;

  // Format date for display
  const formatDate = (dateString?: string) => {
    return formatDateTimeInMelbourne(dateString);
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
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 lg:p-6 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[75vh] overflow-hidden flex flex-col transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <FaFileAlt className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-white">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-all duration-200"
            aria-label="Close modal"
          >
            <FaTimesCircle className="text-2xl" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6 lg:p-8 overflow-y-auto flex-1 bg-white">
          <div className="grid gap-5 md:grid-cols-2">
            {/* ID - Compact Display */}
            <div className="rounded-lg px-4 py-3 border border-gray-200 shadow-sm bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Task ID</span>
                <span className="text-base font-bold text-gray-900">#{task.id}</span>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-lg px-5 py-4 border border-gray-200 shadow-sm bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-100 rounded-lg p-2">
                  <FaFlag className="text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Status</span>
              </div>
              <div className="pl-11">
                <span
                  className={`px-4 py-2 text-sm font-semibold rounded-lg inline-block ${getStatusBadgeColor(
                    task.status
                  )} shadow-sm`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="rounded-lg px-5 py-4 border border-gray-200 shadow-sm bg-gray-50 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <FaFileAlt className="text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Title</span>
              </div>
              <p className="text-base text-gray-900 font-medium leading-relaxed pl-11">{task.title}</p>
            </div>

            {/* Task Code */}
            <div className="rounded-lg px-5 py-4 border border-gray-200 shadow-sm bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <FaBarcode className="text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Task Code</span>
              </div>
              <p className="text-base text-gray-900 font-mono font-semibold pl-11 bg-white px-3 py-2 rounded border border-gray-200 inline-block">
                {task.taskcode}
              </p>
            </div>

            {/* Due Date */}
            <div className="rounded-lg px-5 py-4 border border-gray-200 shadow-sm bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-100 rounded-lg p-2">
                  <FaCalendarAlt className="text-red-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Due Date</span>
              </div>
              <p className="text-sm text-gray-900 font-medium pl-11">{formatDate(task.due_date)}</p>
            </div>

            {/* Description */}
            <div className="rounded-lg px-5 py-4 border border-gray-200 shadow-sm bg-gray-50 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <FaAlignLeft className="text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Description</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed pl-11 whitespace-pre-wrap bg-white px-4 py-3 rounded border border-gray-200 min-h-[60px]">
                {task.description || <span className="text-gray-400 italic">No description provided</span>}
              </p>
            </div>

            {/* Created At */}
            {task.created_at && (
              <div className="rounded-lg px-5 py-4 border border-gray-200 shadow-sm bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-100 rounded-lg p-2">
                    <FaCalendarPlus className="text-indigo-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Created At</span>
                </div>
                <p className="text-sm text-gray-900 font-medium pl-11">{formatDate(task.created_at)}</p>
              </div>
            )}

            {/* Updated At */}
            {task.updated_at && (
              <div className="rounded-lg px-5 py-4 border border-gray-200 shadow-sm bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-teal-100 rounded-lg p-2">
                    <FaSyncAlt className="text-teal-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Updated At</span>
                </div>
                <p className="text-sm text-gray-900 font-medium pl-11">{formatDate(task.updated_at)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

