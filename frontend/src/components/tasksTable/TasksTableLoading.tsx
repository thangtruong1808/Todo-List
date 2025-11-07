/**
 * TasksTableLoading Component
 *
 * Description: Displays the loading state for the tasks table section with a consistent card layout.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

const TasksTableLoading = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    {/* Header skeleton aligned with list heading */}
    <div className="w-full mb-6">
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-10 w-44 bg-gray-200 rounded" />
      </div>
    </div>

    {/* Table skeleton reflecting columns */}
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead>
          <tr className="grid grid-cols-9 gap-3 bg-gray-100 px-2 py-3 rounded">
            {[...Array(9)].map((_, index) => (
              <th key={index} className="h-4 bg-gray-200 rounded" />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex} className="grid grid-cols-9 gap-3 px-2 py-3">
              {[...Array(9)].map((__, colIndex) => (
                <td key={colIndex}>
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination skeleton matching controls */}
    <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="h-4 w-48 bg-gray-200 rounded" />
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export default TasksTableLoading;

