/**
 * TasksTable Component
 *
 * Description: Orchestrates task retrieval, sorting, pagination, and user actions while
 *              delegating UI rendering to smaller presentation components for easier maintenance.
 *
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { Task } from '../types';
import { getAllTasks, deleteTask } from '../services/taskService';
import TasksTableHeader from './tasksTable/TasksTableHeader';
import TasksTableGrid from './tasksTable/TasksTableGrid';
import TasksTablePagination from './tasksTable/TasksTablePagination';
import DeleteTaskModal from './tasksTable/DeleteTaskModal';
import TasksTableLoading from './tasksTable/TasksTableLoading';
import TasksTableError from './tasksTable/TasksTableError';
import TasksTableEmpty from './tasksTable/TasksTableEmpty';

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError<{ error?: string }>(error)) {
    const serverMessage = error.response?.data?.error;
    return serverMessage ?? error.message ?? fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

interface TasksTableProps {
  refreshKey?: number;
  onEditTask?: (task: Task) => void;
}

const TasksTable = ({ refreshKey = 0, onEditTask }: TasksTableProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const rowsPerPageOptions = [5, 10, 20, 50, 100];

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTasks();
      setTasks(data);
    } catch (fetchError: unknown) {
      setError(getErrorMessage(fetchError, 'Failed to fetch tasks. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshKey]);

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedTasks = useMemo(() => {
    if (!sortField) {
      return tasks;
    }

    return [...tasks].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (sortField === 'due_date' || sortField === 'created_at' || sortField === 'updated_at') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
          return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        }
        return 0;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      return 0;
    });
  }, [tasks, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedTasks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentTasks = useMemo(() => {
    return sortedTasks.slice(startIndex, endIndex);
  }, [sortedTasks, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleDeleteTask = (id: number) => {
    const task = tasks.find((entry) => entry.id === id);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete?.id) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteTask(taskToDelete.id);
      toast.success(`Task has been successfully deleted. ID=${taskToDelete.id}, Title="${taskToDelete.title}"`, {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowDeleteModal(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (deleteError: unknown) {
      toast.error(getErrorMessage(deleteError, 'Failed to delete task. Please try again.'), {
        position: 'bottom-left',
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleEditTask = (id: number) => {
    const task = tasks.find((entry) => entry.id === id);
    if (task && onEditTask) {
      onEditTask(task);
    }
  };

  if (loading) {
    return <TasksTableLoading />;
  }

  if (error) {
    return <TasksTableError message={error} onRetry={fetchTasks} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[960px]">
          <TasksTableHeader
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleRowsPerPageChange}
          />

          {tasks.length === 0 ? (
            <TasksTableEmpty />
          ) : (
            <>
              <TasksTableGrid
                visibleTasks={currentTasks}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />

              <TasksTablePagination
                totalPages={totalPages}
                currentPage={currentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={sortedTasks.length}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      <DeleteTaskModal
        task={taskToDelete}
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TasksTable;

