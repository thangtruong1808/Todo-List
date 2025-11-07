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
import { FaCalendarAlt, FaBarcode, FaEye, FaAlignLeft } from 'react-icons/fa';
import { formatTaskDateShort, getStatusBadgeColor } from '../tasksTable/utils';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
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
          <span className="text-xs text-gray-600">{formatTaskDateShort(task.due_date, 'No due date')}</span>
        </div>
      )}
      {task.description && (
        <div className="flex items-start gap-2 mb-2">
          <FaAlignLeft className="text-xs text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600 line-clamp-3">{task.description}</p>
        </div>
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

