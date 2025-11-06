/**
 * Todo Model
 * 
 * Description: TypeScript type definitions for Task and TaskStatus.
 *              Defines the data structure for tasks in the application.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Archived' | 'Overdue';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  taskcode: string;
  due_date?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

