/**
 * Description: Express middleware to centralize uncaught error responses.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Request, Response, NextFunction } from 'express';

export const errorHandler = ( // This function handles errors.
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ // This function sends a 500 error response.
    error: 'Sorry, something went wrong on our end.', // User-facing message
    message: err.message, // Developer-friendly detail
  });
};
