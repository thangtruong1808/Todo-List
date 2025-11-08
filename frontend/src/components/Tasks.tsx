/**
 * Description: Tasks page container managing form and table interactions.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import TasksTable from './TasksTable';
import { Task } from '../types';

const Tasks = () => {
  // Refresh token for table fetch
  const [refreshKey, setRefreshKey] = useState<number>(0);
  // Currently edited task
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Refresh listings and clear edit state
  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setEditingTask(null);
  };

  // Activate edit mode
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tasks Management</h1>
      <div className="max-w-8xl w-full">
        {/* Task form */}
        <CreateTaskForm
          onTaskCreated={handleTaskCreated}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />
      </div>
      <div className="mt-8">
        {/* Task table */}
        <TasksTable refreshKey={refreshKey} onEditTask={handleEditTask} />
      </div>
    </div>
  );
};

export default Tasks;

