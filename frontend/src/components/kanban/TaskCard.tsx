/**
 * TaskCard Component
 *
 * Description: Card component for displaying task information in the Kanban board.
 *              Shows task title, code, due date, and status badge.
 *              Clickable to view full task details.
 *              Supports drag-and-drop without interfering with click events.
 *
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Task } from '../../types';
import { FaCalendarAlt, FaBarcode, FaEye } from 'react-icons/fa';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-200 relative">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800 flex-1 line-clamp-2">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="ml-2 p-1 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors duration-200"
          title="View task details"
        >
          <FaEye className="text-xs" />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <FaBarcode className="text-xs text-gray-500" />
        <span className="text-xs text-gray-600 font-mono">{task.taskcode}</span>
      </div>
      {task.due_date && (
        <div className="flex items-center gap-2 mb-2">
          <FaCalendarAlt className="text-xs text-gray-500" />
          <span className="text-xs text-gray-600">{formatDate(task.due_date)}</span>
        </div>
      )}
      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="mt-2">
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;

