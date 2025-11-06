/**
 * Todo Service
 * 
 * Description: Service layer for task operations (CRUD).
 *              Handles database queries and business logic for tasks.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import pool from '../config/database';
import { Task } from '../models/todo.model';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const [rows] = await pool.execute('SELECT * FROM tasks ORDER BY created_at DESC');
    return rows as Task[];
  },

  getTaskById: async (id: number): Promise<Task | null> => {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    const tasks = rows as Task[];
    return tasks.length > 0 ? tasks[0] : null;
  },

  getTaskByCode: async (taskcode: string): Promise<Task | null> => {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE taskcode = ?', [taskcode]);
    const tasks = rows as Task[];
    return tasks.length > 0 ? tasks[0] : null;
  },

  createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    const { title, description, status, taskcode, due_date } = task;
    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description, status, taskcode, due_date) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, status, taskcode, due_date || null]
    );
    const insertId = (result as any).insertId;
    const newTask = await taskService.getTaskById(insertId);
    return newTask!;
  },

  updateTask: async (id: number, task: Partial<Task>): Promise<Task | null> => {
    const fields: string[] = [];
    const values: any[] = [];

    if (task.title !== undefined) {
      fields.push('title = ?');
      values.push(task.title);
    }
    if (task.description !== undefined) {
      fields.push('description = ?');
      values.push(task.description);
    }
    if (task.status !== undefined) {
      fields.push('status = ?');
      values.push(task.status);
    }
    if (task.taskcode !== undefined) {
      fields.push('taskcode = ?');
      values.push(task.taskcode);
    }
    if (task.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(task.due_date);
    }

    if (fields.length === 0) {
      return await taskService.getTaskById(id);
    }

    values.push(id);
    await pool.execute(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await taskService.getTaskById(id);
  },

  deleteTask: async (id: number): Promise<boolean> => {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },
};

