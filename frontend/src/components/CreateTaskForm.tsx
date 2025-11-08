/**
 * Description: Task creation/edit form with validation and toast feedback.
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
import { fromMelbourneLocalInputToIso, toMelbourneDateTimeLocal } from '../utils/dateUtils';
import { getErrorMessage } from '../utils/errorUtils';

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

  // Track live field values
  const watchedFields = watch();

  // Load edit context or reset defaults
  useEffect(() => {
    if (editingTask) {
      setValue('title', editingTask.title);
      setValue('description', editingTask.description || '');
      setValue('status', editingTask.status);
      setValue('taskcode', editingTask.taskcode);
      setValue('due_date', toMelbourneDateTimeLocal(editingTask.due_date));
    } else {
      reset({
        status: 'Pending',
      });
    }
  }, [editingTask, setValue, reset]);

  // Exit edit mode
  const handleCancelEdit = () => {
    reset({
      title: '',
      description: '',
      status: 'Pending',
      taskcode: '',
      due_date: '',
    });
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  // Persist task changes
  const onSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask && editingTask.id) {
        const attemptingOverdue = data.status === 'Overdue';
        const dueDateIso = data.due_date ? fromMelbourneLocalInputToIso(data.due_date) : undefined;
        const dueDateMs = dueDateIso ? new Date(dueDateIso).getTime() : undefined;
        const nowMs = Date.now();

        if (attemptingOverdue && (!dueDateMs || Number.isNaN(dueDateMs) || dueDateMs > nowMs)) {
          toast.error(
            'This task is not overdue yet. Update the due date or wait until it passes before moving it to Overdue.',
            {
              position: 'bottom-left',
              autoClose: 7000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            },
          );
          return;
        }

        const updatedTask = await updateTask(editingTask.id, {
          title: data.title.trim(),
          description: data.description || undefined,
          status: data.status,
          taskcode: data.taskcode.toUpperCase(),
          due_date: fromMelbourneLocalInputToIso(data.due_date),
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
        const newTask = await createTask({
          title: data.title.trim(),
          description: data.description || undefined,
          status: data.status,
          taskcode: data.taskcode.toUpperCase(),
          due_date: fromMelbourneLocalInputToIso(data.due_date),
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
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, `Failed to ${editingTask ? 'update' : 'create'} task. Please try again.`), {
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
    <div className="bg-white rounded-lg shadow-md p-5 mb-5">
      <FormHeader editingTask={editingTask} onCancelEdit={handleCancelEdit} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Row 1: Title & Code */}
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

        {/* Row 2: Status & Due Date */}
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

        {/* Row 3: Description */}
        <DescriptionField
          register={register}
          touchedFields={touchedFields}
          watchedFields={watchedFields}
        />

        {/* Row 4: Submit */}
        <FormSubmitButton isSubmitting={isSubmitting} editingTask={editingTask} />
      </form>
    </div>
  );
};

export default CreateTaskForm;

