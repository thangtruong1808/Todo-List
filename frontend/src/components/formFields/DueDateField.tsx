/**
 * DueDateField Component
 * 
 * Description: Form field component for task due date input.
 *              Uses datetime-local input type for date and time selection.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FaCalendarAlt, FaCheck } from 'react-icons/fa';
import { TaskFormData } from '../../types';

interface DueDateFieldProps {
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  touchedFields: Partial<Readonly<Record<keyof TaskFormData, boolean>>>;
  watchedFields: TaskFormData;
}

const DueDateField = ({ register, errors, touchedFields, watchedFields }: DueDateFieldProps) => {
  return (
    <div>
      <label htmlFor="due_date" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <FaCalendarAlt className="text-gray-500" />
        <span>Due Date <span className="text-red-500">*</span></span>
      </label>
      <div className="relative">
        <input
          type="datetime-local"
          id="due_date"
          {...register('due_date', { required: 'Due date is required' })}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.due_date
              ? 'border-red-500'
              : touchedFields.due_date && !errors.due_date && watchedFields.due_date
              ? 'border-green-500'
              : 'border-gray-300'
          }`}
        />
        {touchedFields.due_date && !errors.due_date && watchedFields.due_date && (
          <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" />
        )}
      </div>
      {errors.due_date && (
        <p className="mt-1 text-sm text-red-500">{errors.due_date.message}</p>
      )}
    </div>
  );
};

export default DueDateField;

