/**
 * Express Server Configuration
 * 
 * Description: Main Express server setup with CORS, JSON parsing, and API routes.
 *              Handles all HTTP requests and routes them to appropriate controllers.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
// Server port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Todo List API is running' });
});

app.use('/api/tasks', todoRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  // Server started successfully
});

