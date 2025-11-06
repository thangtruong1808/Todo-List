import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';

const router = Router();

// GET all todos
router.get('/', todoController.getAllTodos);

// GET todo by id
router.get('/:id', todoController.getTodoById);

// POST create todo
router.post('/', todoController.createTodo);

// PUT update todo
router.put('/:id', todoController.updateTodo);

// DELETE todo
router.delete('/:id', todoController.deleteTodo);

export default router;

