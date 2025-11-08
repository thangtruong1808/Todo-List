/**
 * Description: Status filter checkbox group supporting select all toggles.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { TaskStatus } from '../../types';
import { FaFilter } from 'react-icons/fa';

// Available task statuses
const statusOptions: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue'];

interface StatusFilterProps {
  selectedStatuses: TaskStatus[];
  onStatusChange: (statuses: TaskStatus[]) => void;
}

const StatusFilter = ({ selectedStatuses, onStatusChange }: StatusFilterProps) => {
  // Toggle a specific status
  const handleStatusToggle = (status: TaskStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  // Toggle select all state
  const handleSelectAll = () => {
    if (selectedStatuses.length === statusOptions.length) {
      onStatusChange([]);
    } else {
      onStatusChange([...statusOptions]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-800">Filter by Status</h2>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Select All / Deselect All */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedStatuses.length === statusOptions.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            {selectedStatuses.length === statusOptions.length ? 'Deselect All' : 'Select All'}
          </span>
        </label>

        {/* Status Checkboxes */}
        {statusOptions.map((status) => (
          <label key={status} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedStatuses.includes(status)}
              onChange={() => handleStatusToggle(status)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{status}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;

