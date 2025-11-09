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
// This is the server configuration file for the Express server.

dotenv.config(); // This function loads the environment variables from the .env file.

const app: Express = express(); // This function creates a new Express application.
// Server port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // This function allows cross-origin requests.
app.use(express.json()); // This function parses the request body as JSON.
app.use(express.urlencoded({ extended: true })); // This function parses the request body as URL encoded data.

// Routes
app.get('/', (req: Request, res: Response) => { // This function handles the root route.
  res.json({ message: 'Todo List API is running' });
});

app.use('/api/tasks', todoRoutes); // This function handles the todo routes.

// Error handling middleware
app.use(errorHandler); // This function handles errors.

// Start server
app.listen(PORT, () => { // This function starts the server.
  // Server started successfully
  console.log(`Server is running on port ${PORT}`); // This function logs a message to the console.
});

