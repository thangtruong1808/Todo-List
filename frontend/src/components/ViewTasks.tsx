/**
 * Description: View Tasks page rendering Kanban board and status filters.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState } from 'react';
import { TaskStatus } from '../types';
import KanbanBoard from './kanban/KanbanBoard';
import StatusFilter from './kanban/StatusFilter';

// Default status selections
const allStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue'];

const ViewTasks = () => {
  // Active status filters
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(allStatuses);

  // Kanban refresh hook
  const handleTaskUpdate = () => {
    // No-op: KanbanBoard manages its own fetch cycle
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

