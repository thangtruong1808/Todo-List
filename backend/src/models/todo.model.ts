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

