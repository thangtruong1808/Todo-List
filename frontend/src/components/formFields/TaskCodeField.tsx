/**
 * TaskCodeField Component
 * 
 * Description: Form field component for task code input.
 *              Validates exactly 5 alphanumeric characters.
 *              Auto-converts to uppercase and filters invalid characters.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FaBarcode, FaCheck } from 'react-icons/fa';
import { TaskFormData } from '../../types';

interface TaskCodeFieldProps {
  register: UseFormRegister<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  touchedFields: Partial<Readonly<Record<keyof TaskFormData, boolean>>>;
  watchedFields: TaskFormData;
}

const TaskCodeField = ({ register, errors, touchedFields, watchedFields }: TaskCodeFieldProps) => {
  return (
    <div>
      <label htmlFor="taskcode" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <FaBarcode className="text-gray-500" />
        <span>Task Code <span className="text-red-500">*</span></span>
      </label>
      <div className="relative">
        <input
          type="text"
          id="taskcode"
          {...register('taskcode', {
            required: 'Task code is required',
            pattern: {
              value: /^[A-Z0-9]{5}$/,
              message: 'Task code must be exactly 5 alphanumeric characters (letters and numbers only)',
            },
            validate: {
              noSpaces: (value) => {
                if (/\s/.test(value)) {
                  return 'Task code cannot contain spaces';
                }
                return true;
              },
              alphanumericOnly: (value) => {
                if (!/^[A-Z0-9]+$/.test(value)) {
                  return 'Task code must contain only letters and numbers';
                }
                return true;
              },
            },
          })}
          onInput={(e) => {
            // Remove spaces and non-alphanumeric characters as user types
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
          }}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  ${errors.taskcode
            ? 'border-red-500'
            : touchedFields.taskcode && !errors.taskcode && watchedFields.taskcode?.length === 5 && /^[A-Z0-9]{5}$/.test(watchedFields.taskcode)
              ? 'border-green-500'
              : 'border-gray-300'
            }`}
          placeholder="Enter task code"
          maxLength={5}
        />
        {touchedFields.taskcode && !errors.taskcode && watchedFields.taskcode?.length === 5 && /^[A-Z0-9]{5}$/.test(watchedFields.taskcode) && (
          <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        )}
      </div>
      {errors.taskcode && (
        <p className="mt-1 text-sm text-red-500">{errors.taskcode.message}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">Must be exactly 5 characters: letters (A-Z) and numbers (0-9) only. No special characters or spaces.</p>
    </div>
  );
};

export default TaskCodeField;

