/**
 * TasksTableGrid Component
 *
 * Description: Displays the sortable task table, including column headers, data rows,
 *              and action buttons for editing and deleting tasks.
 *              Matches the styling and responsiveness of the original TasksTable layout.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

import { FaAlignLeft, FaCalendarAlt, FaCalendarPlus, FaEdit, FaFlag, FaSort, FaSortDown, FaSortUp, FaSyncAlt, FaTrash, FaFileAlt } from 'react-icons/fa';
import { Task } from '../../types';
import { formatTaskDate, formatTaskDateShort, getStatusBadgeColor } from './utils';

interface TasksTableGridProps {
  visibleTasks: Task[];
  sortField: keyof Task | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Task) => void;
  onEditTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TasksTableGrid = ({
  visibleTasks,
  sortField,
  sortDirection,
  onSort,
  onEditTask,
  onDeleteTask,
}: TasksTableGridProps) => {
  const renderSortIcon = (field: keyof Task) => {
    if (sortField !== field) {
      return <FaSort className="text-gray-400" />;
    }
    return sortDirection === 'asc' ? <FaSortUp className="text-gray-600" /> : <FaSortDown className="text-gray-600" />;
  };

  return (
    <table className="w-full divide-y divide-gray-200 lg:table-fixed">
      <thead className="bg-gray-50 hidden sm:table-header-group">
        <tr>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 lg:w-16"
            onClick={() => onSort('id')}
          >
            <div className="flex items-center space-x-1">
              <span>ID</span>
              {renderSortIcon('id')}
            </div>
          </th>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 lg:w-24"
            onClick={() => onSort('taskcode')}
          >
            <div className="flex items-center space-x-1">
              <span>Code</span>
              {renderSortIcon('taskcode')}
            </div>
          </th>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 lg:w-56"
            onClick={() => onSort('title')}
          >
            <div className="flex items-center space-x-1">
              <FaFileAlt className="text-gray-500" />
              <span>Title</span>
              {renderSortIcon('title')}
            </div>
          </th>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-100 transition-colors duration-200 lg:w-72"
            onClick={() => onSort('description')}
          >
            <div className="flex items-center space-x-1">
              <FaAlignLeft className="text-gray-500" />
              <span>Description</span>
              {renderSortIcon('description')}
            </div>
          </th>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 lg:w-28"
            onClick={() => onSort('status')}
          >
            <div className="flex items-center space-x-1">
              <FaFlag className="text-gray-500" />
              <span>Status</span>
              {renderSortIcon('status')}
            </div>
          </th>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 lg:w-40"
            onClick={() => onSort('due_date')}
          >
            <div className="flex items-center space-x-1">
              <FaCalendarAlt className="text-gray-500" />
              <span>Due Date</span>
              {renderSortIcon('due_date')}
            </div>
          </th>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-36"
            onClick={() => onSort('created_at')}
          >
            <div className="flex items-center space-x-1">
              <FaCalendarPlus className="text-gray-500" />
              <span>Created</span>
              {renderSortIcon('created_at')}
            </div>
          </th>
          <th
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-36"
            onClick={() => onSort('updated_at')}
          >
            <div className="flex items-center space-x-1">
              <FaSyncAlt className="text-gray-500" />
              <span>Updated</span>
              {renderSortIcon('updated_at')}
            </div>
          </th>
          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:w-32">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {visibleTasks.map((task) => (
          <tr key={task.id} className="hover:bg-gray-100">
            <td className="px-2 py-1 text-xs text-gray-900">
              <div className="flex flex-col sm:block">
                <span className="font-semibold sm:font-normal">{task.id}</span>
                <span className="sm:hidden text-gray-500">{task.taskcode}</span>
              </div>
            </td>
            <td className="px-2 py-1 text-xs text-gray-900 hidden sm:table-cell lg:whitespace-nowrap">{task.taskcode}</td>
            <td className="px-2 py-1 text-xs text-gray-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="font-medium line-clamp-2" title={task.title}>{task.title}</span>
                <span className="sm:hidden text-gray-500">Due: {formatTaskDateShort(task.due_date)}</span>
              </div>
            </td>
            <td
              className="px-2 py-1 text-xs text-gray-600 truncate hidden lg:table-cell"
              title={task.description || 'N/A'}
            >
              {task.description || 'N/A'}
            </td>
            <td className="px-2 py-1 text-xs">
              <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeColor(task.status)}`}>
                {task.status}
              </span>
            </td>
            <td className="px-2 py-1 text-xs text-gray-600 hidden sm:table-cell lg:whitespace-nowrap">
              {formatTaskDate(task.due_date)}
            </td>
            <td className="px-2 py-1 text-xs text-gray-600 hidden xl:table-cell lg:whitespace-nowrap">
              {formatTaskDateShort(task.created_at)}
            </td>
            <td className="px-2 py-1 text-xs text-gray-600 hidden xl:table-cell lg:whitespace-nowrap">
              {formatTaskDateShort(task.updated_at)}
            </td>
            <td className="px-2 py-1 text-xs">
              <div className="flex items-center justify-end sm:justify-start gap-1">
                <button
                  onClick={() => task.id && onEditTask(task.id)}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center gap-1 text-xs"
                  title="Edit task"
                >
                  <FaEdit className="text-xs" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => task.id && onDeleteTask(task.id)}
                  className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 flex items-center gap-1 text-xs"
                  title="Delete task"
                >
                  <FaTrash className="text-xs" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TasksTableGrid;

