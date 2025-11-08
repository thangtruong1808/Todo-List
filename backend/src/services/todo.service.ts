/**
 * Description: Service layer encapsulating CRUD queries against the tasks table.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import pool, { DB_TIME_ZONE } from '../config/database';
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
    return formatDateInZone(value, MELBOURNE_TIME_ZONE);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (!/([zZ]|[+-]\d{2}:\d{2})$/.test(trimmed)) {
    if (DB_TIME_ZONE.toLowerCase() === MELBOURNE_TIME_ZONE.toLowerCase()) {
      return trimmed;
    }
    return convertZoneString(trimmed, DB_TIME_ZONE, MELBOURNE_TIME_ZONE) ?? trimmed;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return formatDateInZone(date, MELBOURNE_TIME_ZONE);
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

const getOffsetMinutes = (utcMs: number, timeZone: string): number => {
  if (timeZone.toLowerCase() === 'local') {
    return -new Date(utcMs).getTimezoneOffset();
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date(utcMs)).reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

    const { year, month, day, hour, minute, second } = parts;
    if (!year || !month || !day || !hour || !minute || !second) {
      return 0;
    }

    const asUtc = Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );

    return (asUtc - utcMs) / 60000;
  } catch {
    return 0;
  }
};

const formatDateInZone = (date: Date, timeZone: string): string | undefined => {
  try {
    const formatter = new Intl.DateTimeFormat('en-AU', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

    const { year, month, day, hour, minute, second } = parts;
    if (!year || !month || !day || !hour || !minute || !second) {
      return undefined;
    }

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } catch {
    return undefined;
  }
};

const convertZoneString = (value: string, fromZone: string, toZone: string): string | undefined => {
  const sanitized = value.replace('T', ' ');
  const match = sanitized.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    return value;
  }

  if (fromZone.toLowerCase() === toZone.toLowerCase()) {
    return value;
  }

  const [, year, month, day, hour, minute, second] = match;
  const baseUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  const fromOffset = getOffsetMinutes(baseUtc, fromZone);
  const utcMs = baseUtc - fromOffset * 60000;

  const toOffset = getOffsetMinutes(utcMs, toZone);
  const targetMs = utcMs + toOffset * 60000;

  return formatDateInZone(new Date(targetMs), toZone);
};

