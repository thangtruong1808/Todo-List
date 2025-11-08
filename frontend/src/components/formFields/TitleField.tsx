/**
 * TitleField Component
 * 
 * Description: Form field component for task title input.
 *              Includes validation, real-time filtering, and visual feedback.
 *              Displays checkmark icon when validation passes.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { FaFileAlt, FaCheck } from 'react-icons/fa';
import { TaskFormData } from '../../types';

interface TitleFieldProps {
  register: UseFormRegister<TaskFormData>;
  setValue: UseFormSetValue<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
  touchedFields: Partial<Readonly<Record<keyof TaskFormData, boolean>>>;
  watchedFields: TaskFormData;
}

const TitleField = ({ register, setValue, errors, touchedFields, watchedFields }: TitleFieldProps) => {
  return (
    <div>
      <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <FaFileAlt className="text-gray-500" />
        <span>Title <span className="text-red-500">*</span></span>
      </label>
      <div className="relative">
        <input
          type="text"
          id="title"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
            maxLength: {
              value: 100,
              message: 'Title must be 100 characters or less',
            },
            validate: {
              notWhitespaceOnly: (value) => value.trim().length > 0 || 'Title cannot be empty or whitespace only',
              noHtmlTags: (value) => !/<[^>]*>/.test(value) || 'HTML tags are not allowed',
              allowedCharacters: (value) =>
                /^[A-Za-z0-9\s.,!?'"-]+$/.test(value) ||
                'Title must contain only letters, numbers, spaces, and basic punctuation (., !, ?, \', ", -)',
            },
          })}
          onInput={(e) => {
            // Remove disallowed characters while typing
            const target = e.target as HTMLInputElement;
            const filteredValue = target.value.replace(/[^A-Za-z0-9\s.,!?'"-]/g, '');
            target.value = filteredValue;
            // Update React Hook Form value to trigger validation
            setValue('title', filteredValue, { shouldValidate: true, shouldTouch: true });
          }}
          onBlur={(e) => {
            // Trim leading/trailing spaces when field loses focus
            const target = e.target as HTMLInputElement;
            const trimmedValue = target.value.trim();
            target.value = trimmedValue;
            // Update React Hook Form value
            setValue('title', trimmedValue, { shouldValidate: true, shouldTouch: true });
          }}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title
            ? 'border-red-500'
            : touchedFields.title &&
              !errors.title &&
              watchedFields.title &&
              watchedFields.title.trim().length >= 3 &&
              /^[A-Za-z0-9\s.,!?'"-]+$/.test(watchedFields.title.trim())
              ? 'border-green-500'
              : 'border-gray-300'
            }`}
          placeholder="Enter task title"
          maxLength={100}
        />
        {touchedFields.title &&
          !errors.title &&
          watchedFields.title &&
          watchedFields.title.trim().length >= 3 &&
          /^[A-Za-z0-9\s.,!?'"-]+$/.test(watchedFields.title.trim()) && (
            <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
          )}
      </div>
      {errors.title && (
        <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
      )}
    </div>
  );
};

export default TitleField;

