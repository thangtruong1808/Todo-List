/**
 * KanbanBoardLoading Component
 *
 * Description: Displays skeleton placeholders matching the Kanban board layout while data loads.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

// Column placeholders shown during loading.
const columnPlaceholders = ['Pending', 'In Progress', 'Completed', 'Archived', 'Overdue'];

const KanbanBoardLoading = () => (
  <div className="w-full animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {columnPlaceholders.map((column) => (
        <div key={column} className="flex flex-col bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          {/* Column header skeleton */}
          <div className="bg-gray-100 p-3 border-b border-gray-200">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded mt-2" />
          </div>
          {/* Cards skeleton */}
          <div className="p-3 space-y-3" style={{ minHeight: '260px' }}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default KanbanBoardLoading;
