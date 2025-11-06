import { Router } from 'express';
import * as taskController from '../controllers/todo.controller';

const router = Router();

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET task by id
router.get('/:id', taskController.getTaskById);

// POST create task
router.post('/', taskController.createTask);

// PUT update task
router.put('/:id', taskController.updateTask);

// DELETE task
router.delete('/:id', taskController.deleteTask);

export default router;

