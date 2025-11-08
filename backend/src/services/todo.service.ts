/**
 * Description: Service layer encapsulating CRUD queries against the tasks table.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import pool, { DB_TIME_ZONE } from '../config/database';
import moment from 'moment-timezone';
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

const toMelbourneTimestampString = (value?: string | Date | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return moment(value).tz(MELBOURNE_TIME_ZONE).format('YYYY-MM-DD HH:mm:ss');
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const sourceZone = DB_TIME_ZONE || 'UTC';

  try {
    if (/([zZ]|[+-]\d{2}:\d{2})$/.test(trimmed)) {
      return moment.tz(trimmed, MELBOURNE_TIME_ZONE).format('YYYY-MM-DD HH:mm:ss');
    }

    const sourceMoment = moment.tz(trimmed, 'YYYY-MM-DD HH:mm:ss', sourceZone);
    if (!sourceMoment.isValid()) {
      return trimmed;
    }

    return sourceMoment.tz(MELBOURNE_TIME_ZONE).format('YYYY-MM-DD HH:mm:ss');
  } catch {
    return trimmed;
  }
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

const getOffsetMinutes = (_utcMs: number, _timeZone: string): number => 0;
const formatDateInZone = (_date: Date, _timeZone: string): string | undefined => undefined;
const convertZoneString = (_value: string, _fromZone: string, _toZone: string): string | undefined => undefined;

