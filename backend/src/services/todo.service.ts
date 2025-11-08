/**
 * Description: Service layer encapsulating CRUD queries against the tasks table.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import pool from '../config/database';
import { Task } from '../models/todo.model';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const [rows] = await pool.execute('SELECT * FROM tasks ORDER BY created_at DESC'); // Fetch tasks newest first
    return (rows as Task[]).map(normalizeTaskTimestamps);
  },

  getTaskById: async (id: number): Promise<Task | null> => {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]); // Fetch task by primary key
    const tasks = rows as Task[];
    return tasks.length > 0 ? normalizeTaskTimestamps(tasks[0]) : null;
  },

  getTaskByCode: async (taskcode: string): Promise<Task | null> => {
    const [rows] = await pool.execute('SELECT * FROM tasks WHERE taskcode = ?', [taskcode]); // Fetch by business code
    const tasks = rows as Task[];
    return tasks.length > 0 ? normalizeTaskTimestamps(tasks[0]) : null;
  },

  createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    const { title, description, status, taskcode, due_date } = task;
    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description, status, taskcode, due_date) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, status, taskcode, due_date || null]
    ); // Insert new row
    const insertId = (result as any).insertId; // Extract generated id
    const newTask = await taskService.getTaskById(insertId); // Re-fetch to include timestamps
    return newTask!;
  },

  updateTask: async (id: number, task: Partial<Task>): Promise<Task | null> => {
    const fields: string[] = []; // Accumulated SET clauses
    const values: any[] = []; // Values aligned with SET clauses

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
      return await taskService.getTaskById(id); // Nothing to update, return current record
    }

    fields.push('updated_at = NOW()'); // Stamp modification time

    values.push(id);
    await pool.execute(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    ); // Execute dynamic update

    return await taskService.getTaskById(id); // Return refreshed record
  },

  deleteTask: async (id: number): Promise<boolean> => {
    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]); // Delete task by id
    return (result as any).affectedRows > 0; // True when a row was removed
  },
};

const MELBOURNE_TIME_ZONE = 'Australia/Melbourne';

// Convert timestamp to Melbourne timezone string
const toMelbourneTimestampString = (value?: string | Date | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  let isoCandidate: string;

  if (value instanceof Date) {
    const adjusted = value.toLocaleString('en-US', { timeZone: MELBOURNE_TIME_ZONE, hour12: false });
    const normalized = adjusted.replace(',', '');
    const match = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
    if (!match) {
      return undefined;
    }
    const [, month, day, year, hour, minute, second] = match;
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay} ${hour}:${minute}:${second}`;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (!/([zZ]|[+-]\d{2}:\d{2})$/.test(trimmed)) {
    return trimmed;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const adjusted = date.toLocaleString('en-US', { timeZone: MELBOURNE_TIME_ZONE, hour12: false });
  const normalized = adjusted.replace(',', '');
  const match = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    return undefined;
  }
  const [, month, day, year, hour, minute, second] = match;
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay} ${hour}:${minute}:${second}`;
};

// Normalize task timestamps to Melbourne timezone string
const normalizeTaskTimestamps = (task: Task): Task => {
  const createdAt = toMelbourneTimestampString(task.created_at ?? undefined);
  const updatedAt = toMelbourneTimestampString(task.updated_at ?? undefined);

  return {
    ...task,
    created_at: createdAt ?? task.created_at,
    updated_at: updatedAt ?? task.updated_at,
  };
};

