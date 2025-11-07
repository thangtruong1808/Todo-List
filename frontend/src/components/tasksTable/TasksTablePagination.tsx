/**
 * TasksTablePagination Component
 *
 * Description: Provides the pagination controls for the tasks list, including
 *              navigational buttons and condensed ellipsis rendering for large page sets.
 *              Mirrors the original TasksTable pagination styling and spacing.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

interface TasksTablePaginationProps {
  totalPages: number;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const TasksTablePagination = ({
  totalPages,
  currentPage,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: TasksTablePaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const buildPages = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let index = 1; index <= totalPages; index += 1) {
        pages.push(index);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis-start');
    }

    const localStart = Math.max(2, currentPage - 1);
    const localEnd = Math.min(totalPages - 1, currentPage + 1);

    for (let index = localStart; index <= localEnd; index += 1) {
      pages.push(index);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = buildPages();

  return (
    <div className="flex items-center justify-between pt-6 pb-3 border-t border-gray-200 px-2 lg:px-2">
      <div className="text-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} tasks
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        <div className="flex space-x-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            const numericPage = page as number;
            const isActive = currentPage === numericPage;

            return (
              <button
                key={numericPage}
                onClick={() => onPageChange(numericPage)}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {numericPage}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default TasksTablePagination;

