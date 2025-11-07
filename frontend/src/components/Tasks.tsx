/**
 * Tasks Component
 * 
 * Description: Tasks page component for creating, editing, and managing tasks.
 *              Integrates CreateTaskForm and TasksTable components.
 *              Manages state for editing task and coordinates between form and table.
 *              Provides functionality to create new tasks, edit existing tasks, and view all tasks with pagination.
 *              Automatically scrolls to form when edit button is clicked.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import TasksTable from './TasksTable';
import { Task } from '../types';

const Tasks = () => {
  // State to trigger table refresh
  const [refreshKey, setRefreshKey] = useState<number>(0);
  // State for editing task
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handle task created/updated callback
  const handleTaskCreated = () => {
    // Increment refresh key to trigger table refresh
    setRefreshKey((prev) => prev + 1);
    // Clear editing task
    setEditingTask(null);
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tasks Management</h1>
      <div className="max-w-5xl w-full">
        <CreateTaskForm
          onTaskCreated={handleTaskCreated}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />
      </div>
      <div className="mt-8">
        <TasksTable refreshKey={refreshKey} onEditTask={handleEditTask} />
      </div>
    </div>
  );
};

export default Tasks;

