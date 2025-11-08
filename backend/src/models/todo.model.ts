/**
 * Description: TypeScript type definitions representing tasks and allowed statuses.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Archived' | 'Overdue'; // Valid status values

export interface Task {
  id?: number; // Primary key (auto increment)
  title: string; // Task title
  description?: string; // Optional task description
  status: TaskStatus; // Current task status
  taskcode: string; // Human-readable task identifier
  due_date?: Date | string; // Optional due date
  created_at?: Date | string; // Timestamp when created (from DB)
  updated_at?: Date | string; // Timestamp when last updated (from DB)
}

