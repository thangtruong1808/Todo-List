/**
 * FormHeader Component
 * 
 * Description: Header component for task form.
 *              Displays form title and cancel button when editing.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { FaTimes } from 'react-icons/fa';
import { Task } from '../../types';

interface FormHeaderProps {
  editingTask?: Task | null;
  onCancelEdit?: () => void;
}

const FormHeader = ({ editingTask, onCancelEdit }: FormHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800">
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </h2>
      {editingTask && onCancelEdit && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center space-x-2"
        >
          <FaTimes />
          <span>Cancel</span>
        </button>
      )}
    </div>
  );
};

export default FormHeader;

