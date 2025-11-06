/**
 * FormSubmitButton Component
 * 
 * Description: Submit button component for task form.
 *              Shows loading state during submission.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { FaPlus, FaSpinner } from 'react-icons/fa';
import { Task } from '../../types';

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  editingTask?: Task | null;
}

const FormSubmitButton = ({ isSubmitting, editingTask }: FormSubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>{editingTask ? 'Updating...' : 'Creating...'}</span>
          </>
        ) : (
          <>
            <FaPlus />
            <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FormSubmitButton;

