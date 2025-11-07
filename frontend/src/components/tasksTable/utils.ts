/**
 * TasksTable Utilities
 *
 * Description: Helper functions for formatting task dates and determining status badge styling
 *              used across the tasks table sub-components.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

import { formatDateTimeInMelbourne } from '../../utils/dateUtils';

export const formatTaskDate = (dateString?: string, fallback = 'N/A') => {
  return formatDateTimeInMelbourne(dateString, undefined, fallback);
};

export const formatTaskDateShort = (dateString?: string, fallback = 'N/A') => {
  return formatDateTimeInMelbourne(
    dateString,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    fallback,
  );
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Archived':
      return 'bg-gray-100 text-gray-800';
    case 'Overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

