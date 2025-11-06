import { Request, Response } from 'express';
import { taskService } from '../services/todo.service';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await taskService.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error: any) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, taskcode, due_date } = req.body;

    if (!title || !taskcode) {
      return res.status(400).json({ error: 'Title and taskcode are required' });
    }

    if (taskcode.length !== 5) {
      return res.status(400).json({ error: 'Taskcode must be exactly 5 characters' });
    }

    const existingTask = await taskService.getTaskByCode(taskcode);
    if (existingTask) {
      return res.status(400).json({ error: 'Taskcode already exists' });
    }

    const task = await taskService.createTask({
      title,
      description,
      status: status || 'Pending',
      taskcode,
      due_date,
    });

    res.status(201).json(task);
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const { taskcode } = req.body;
    if (taskcode && taskcode.length !== 5) {
      return res.status(400).json({ error: 'Taskcode must be exactly 5 characters' });
    }

    if (taskcode) {
      const existingTask = await taskService.getTaskByCode(taskcode);
      if (existingTask && existingTask.id !== taskId) {
        return res.status(400).json({ error: 'Taskcode already exists' });
      }
    }

    const task = await taskService.updateTask(taskId, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const deleted = await taskService.deleteTask(taskId);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

