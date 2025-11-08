/**
 * Description: Shared helpers for normalizing API error messages.
 * Date Created: 2025-November-08
 * Author: thangtruong
 */

import { isAxiosError } from 'axios';

// Interpret backend or network errors
export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError<{ error?: string }>(error)) {
    const serverMessage = error.response?.data?.error;
    return serverMessage ?? error.message ?? fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

