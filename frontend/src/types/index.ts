export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Archived' | 'Overdue';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  taskcode: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  taskcode: string;
  due_date: string;
}

