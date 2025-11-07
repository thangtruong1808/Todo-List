/**
 * Task Service
 * 
 * Description: Service functions for making API calls to the backend task endpoints.
 *              Handles CRUD operations for tasks.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import api from './api';
import { Task, TaskStatus } from '../types';

const shouldMarkTaskAsOverdue = (task: Task, now: Date): task is Task & { id: number } => {
  if (!task.id) {
    return false;
  }

  if (!task.due_date) {
    return false;
  }

  if (task.status !== 'Pending' && task.status !== 'In Progress') {
    return false;
  }

  const dueDate = new Date(task.due_date);
  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return dueDate.getTime() < now.getTime();
};

const normalizeOverdueTasks = async (tasks: Task[]): Promise<Task[]> => {
  const now = new Date();
  const overdueCandidates = tasks.filter((task): task is Task & { id: number } => shouldMarkTaskAsOverdue(task, now));

  if (overdueCandidates.length === 0) {
    return tasks;
  }

  const updates = await Promise.all(
    overdueCandidates.map(async (task) => {
      try {
        const response = await api.put(`/tasks/${task.id}`, { status: 'Overdue' satisfies TaskStatus });
        return response.data as Task;
      } catch (error) {
        return null;
      }
    })
  );

  const updatedTaskMap = new Map<number, Task>();
  updates
    .filter((result): result is Task => result !== null && typeof result.id === 'number')
    .forEach((updatedTask) => {
      updatedTaskMap.set(updatedTask.id!, updatedTask);
    });

  return tasks.map((task) => {
    if (task.id && updatedTaskMap.has(task.id)) {
      return updatedTaskMap.get(task.id)!;
    }
    if (shouldMarkTaskAsOverdue(task, now)) {
      return { ...task, status: 'Overdue' };
    }
    return task;
  });
};

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  const tasks = response.data as Task[];
  return normalizeOverdueTasks(tasks);
};

// Get task by ID
export const getTaskById = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

// Create new task
export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  const response = await api.post('/tasks', task);
  return response.data;
};

// Update task
export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
};

// Delete task
export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

