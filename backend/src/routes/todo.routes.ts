/**
 * Description: Express router wiring HTTP verbs to todo controller handlers.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Router } from 'express';
import * as taskController from '../controllers/todo.controller';

const router = Router();

// GET /api/tasks → list tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id → show task
router.get('/:id', taskController.getTaskById);

// POST /api/tasks → create task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id → update task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id → remove task
router.delete('/:id', taskController.deleteTask);

export default router;

