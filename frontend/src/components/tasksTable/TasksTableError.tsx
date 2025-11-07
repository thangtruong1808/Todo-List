/**
 * TasksTableError Component
 *
 * Description: Shows an error message with a retry button matching the tasks table styling.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

interface TasksTableErrorProps {
  message: string;
  onRetry: () => void;
}

const TasksTableError = ({ message, onRetry }: TasksTableErrorProps) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="text-center py-8">
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);

export default TasksTableError;

