/**
 * StatusField Component
 * 
 * Description: Form field component for task status dropdown.
 *              Displays all available status options.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FaFlag, FaCheck } from 'react-icons/fa';
import { TaskFormData, TaskStatus } from '../../types';

interface StatusFieldProps {
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  touchedFields: Partial<Readonly<Record<keyof TaskFormData, boolean>>>;
  watchedFields: TaskFormData;
}

// Status options
const statusOptions: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue'];

const StatusField = ({ register, errors, touchedFields, watchedFields }: StatusFieldProps) => {
  return (
    <div>
      <label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <FaFlag className="text-gray-500" />
        <span>Status <span className="text-red-500">*</span></span>
      </label>
      <div className="relative">
        <select
          id="status"
          {...register('status', { required: 'Status is required' })}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status
              ? 'border-red-500'
              : touchedFields.status && !errors.status && watchedFields.status
                ? 'border-green-500'
                : 'border-gray-300'
            }`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {touchedFields.status && !errors.status && watchedFields.status && (
          <FaCheck className="absolute right-8 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none z-10" />
        )}
      </div>
      {errors.status && (
        <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
      )}
    </div>
  );
};

export default StatusField;

