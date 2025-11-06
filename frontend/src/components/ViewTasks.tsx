/**
 * View Tasks Component
 *
 * Description: View Tasks page component for displaying and managing existing tasks.
 *              Displays tasks in a Kanban board view with drag-and-drop functionality.
 *              Includes status filter component to filter tasks by status.
 *
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState } from 'react';
import { TaskStatus } from '../types';
import KanbanBoard from './kanban/KanbanBoard';
import StatusFilter from './kanban/StatusFilter';

// All available statuses - default statuses for filter (all selected)
const allStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue'];

const ViewTasks = () => {
  // State for selected statuses (all selected by default)
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(allStatuses);

  // Handle task update from Kanban board
  const handleTaskUpdate = () => {
    // Refresh is handled by KanbanBoard internally
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">View Tasks - Kanban Board</h1>
      
      {/* Status Filter */}
      <StatusFilter
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
      />

      {/* Kanban Board */}
      <div className="mb-8">
        <KanbanBoard onTaskUpdate={handleTaskUpdate} selectedStatuses={selectedStatuses} />
      </div>
    </div>
  );
};

export default ViewTasks;

