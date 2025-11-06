/**
 * CreateTaskForm Component
 * 
 * Description: Main form component for creating and editing tasks.
 *              Uses React Hook Form for form validation and management.
 *              Supports both create and edit modes based on editingTask prop.
 *              Composed of smaller field components for better maintainability.
 *              Displays toast notifications for success and error states.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { createTask, updateTask } from '../services/taskService';
import { Task, TaskFormData } from '../types';
import TitleField from './formFields/TitleField';
import TaskCodeField from './formFields/TaskCodeField';
import StatusField from './formFields/StatusField';
import DueDateField from './formFields/DueDateField';
import DescriptionField from './formFields/DescriptionField';
import FormHeader from './formFields/FormHeader';
import FormSubmitButton from './formFields/FormSubmitButton';

interface CreateTaskFormProps {
  onTaskCreated: () => void;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
}

const CreateTaskForm = ({ onTaskCreated, editingTask, onCancelEdit }: CreateTaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    watch,
    reset,
    setValue,
  } = useForm<TaskFormData>({
    defaultValues: {
      status: 'Pending',
    },
  });

  // Watch field values for validation check
  const watchedFields = watch();

  // Populate form when editing task
  useEffect(() => {
    if (editingTask) {
      // Format due_date for datetime-local input
      const dueDate = editingTask.due_date
        ? new Date(editingTask.due_date).toISOString().slice(0, 16)
        : '';

      setValue('title', editingTask.title);
      setValue('description', editingTask.description || '');
      setValue('status', editingTask.status);
      setValue('taskcode', editingTask.taskcode);
      setValue('due_date', dueDate);
    } else {
      // Reset form when not editing
      reset({
        status: 'Pending',
      });
    }
  }, [editingTask, setValue, reset]);

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset all form fields to default values
    reset({
      title: '',
      description: '',
      status: 'Pending',
      taskcode: '',
      due_date: '',
    });
    // Call parent cancel handler
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  // Handle form submission
  const onSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask && editingTask.id) {
        // Update existing task
        const updatedTask = await updateTask(editingTask.id, {
          title: data.title.trim(),
          description: data.description || undefined,
          status: data.status,
          taskcode: data.taskcode.toUpperCase(),
          due_date: data.due_date,
        });
        toast.success(`Task has been successfully updated. ID=${updatedTask.id}, Title="${updatedTask.title}"`, {
          position: 'bottom-left',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Create new task
        const newTask = await createTask({
          title: data.title.trim(),
          description: data.description || undefined,
          status: data.status,
          taskcode: data.taskcode.toUpperCase(),
          due_date: data.due_date,
        });
        toast.success(`Task has been successfully created. ID=${newTask.id}, Title="${newTask.title}"`, {
          position: 'bottom-left',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      reset();
      onTaskCreated();
      if (onCancelEdit) {
        onCancelEdit();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || `Failed to ${editingTask ? 'update' : 'create'} task. Please try again.`, {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <FormHeader editingTask={editingTask} onCancelEdit={handleCancelEdit} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Row: Title and Task Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TitleField
            register={register}
            setValue={setValue}
            errors={errors}
            touchedFields={touchedFields}
            watchedFields={watchedFields}
          />
          <TaskCodeField
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            watchedFields={watchedFields}
          />
        </div>

        {/* Second Row: Status and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusField
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            watchedFields={watchedFields}
          />
          <DueDateField
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            watchedFields={watchedFields}
          />
        </div>

        {/* Description Field - Full Width */}
        <DescriptionField
          register={register}
          touchedFields={touchedFields}
          watchedFields={watchedFields}
        />

        {/* Submit Button */}
        <FormSubmitButton isSubmitting={isSubmitting} editingTask={editingTask} />
      </form>
    </div>
  );
};

export default CreateTaskForm;

