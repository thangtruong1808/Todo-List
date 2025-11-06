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
import { Task } from '../types';

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
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

