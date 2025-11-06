/**
 * Error Handler Middleware
 * 
 * Description: Global error handling middleware for Express.
 *              Catches and handles all unhandled errors in the application.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
};

