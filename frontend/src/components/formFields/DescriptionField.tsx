/**
 * DescriptionField Component
 * 
 * Description: Form field component for task description textarea.
 *              Optional field with visual feedback when filled.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { UseFormRegister } from 'react-hook-form';
import { FaAlignLeft, FaCheck } from 'react-icons/fa';
import { TaskFormData } from '../../types';

interface DescriptionFieldProps {
  register: UseFormRegister<TaskFormData>;
  touchedFields: Partial<Readonly<Record<keyof TaskFormData, boolean>>>;
  watchedFields: TaskFormData;
}

const DescriptionField = ({ register, touchedFields, watchedFields }: DescriptionFieldProps) => {
  return (
    <div>
      <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <FaAlignLeft className="text-gray-500" />
        <span>Description</span>
      </label>
      <div className="relative">
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            touchedFields.description && watchedFields.description
              ? 'border-green-500'
              : 'border-gray-300'
          }`}
          placeholder="Enter task description (optional)"
        />
        {touchedFields.description && watchedFields.description && (
          <FaCheck className="absolute right-3 top-3 text-green-500 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default DescriptionField;

