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
import { normalizeToMelbourneIso } from '../utils/dateUtils';

const isActiveStatus = (status: TaskStatus) => status === 'Pending' || status === 'In Progress';

// This function checks if a task should be marked as overdue.
const shouldMarkTaskAsOverdue = (task: Task, now: Date): task is Task & { id: number } => {
  if (!task.id) {
    return false;
  }

  if (!task.due_date) {
    return false;
  }

  if (!isActiveStatus(task.status)) {
    return false;
  }

  const normalizedDueDate = normalizeToMelbourneIso(task.due_date);
  if (!normalizedDueDate) {
    return false;
  }

  const dueDate = new Date(normalizedDueDate);
  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return dueDate.getTime() < now.getTime();
};

// This function checks if a task should be reset to the pending status.
const shouldResetOverdueStatus = (task: Task, now: Date): task is Task & { id: number } => {
  if (!task.id) {
    return false;
  }

  if (task.status !== 'Overdue') {
    return false;
  }

  if (!task.due_date) {
    return false;
  }

  const normalizedDueDate = normalizeToMelbourneIso(task.due_date);
  if (!normalizedDueDate) {
    return false;
  }

  const dueDate = new Date(normalizedDueDate);
  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return dueDate.getTime() >= now.getTime();
};

// This function normalizes the overdue tasks.
const normalizeOverdueTasks = async (tasks: Task[]): Promise<Task[]> => {
  const now = new Date();
  const overdueCandidates = tasks.filter((task): task is Task & { id: number } => shouldMarkTaskAsOverdue(task, now));
  const resetCandidates = tasks.filter((task): task is Task & { id: number } => shouldResetOverdueStatus(task, now));

  if (overdueCandidates.length === 0 && resetCandidates.length === 0) {
    return tasks;
  }

  // This function updates the overdue tasks.
  const updates = await Promise.all(
    [
      ...overdueCandidates.map<Task & { desiredStatus: TaskStatus }>((task) => ({ ...task, desiredStatus: 'Overdue' })),
      ...resetCandidates.map<Task & { desiredStatus: TaskStatus }>((task) => ({ ...task, desiredStatus: 'Pending' })),
    ].map(async (task) => {
      try {
        const response = await api.put(`/tasks/${task.id}`, { status: task.desiredStatus satisfies TaskStatus });
        return response.data as Task;
      } catch (error) { // If the task is not updated, return null.
        return null;
      }
    })
  );

  // This function updates the overdue tasks.
  const updatedTaskMap = new Map<number, Task>();
  updates
    .filter((result): result is Task => result !== null && typeof result.id === 'number')
    .forEach((updatedTask) => {
      updatedTaskMap.set(updatedTask.id!, updatedTask);
    });

  // This function returns the updated tasks.
  return tasks.map((task) => {
    if (task.id && updatedTaskMap.has(task.id)) {
      return updatedTaskMap.get(task.id)!;
    }
    if (shouldMarkTaskAsOverdue(task, now)) {
      return { ...task, status: 'Overdue' };
    }
    if (shouldResetOverdueStatus(task, now)) {
      return { ...task, status: 'Pending' };
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

