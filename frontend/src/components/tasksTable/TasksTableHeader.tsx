/**
 * TasksTableHeader Component
 *
 * Description: Renders the table title and rows-per-page selector for the tasks list.
 *              Keeps control layout consistent across breakpoints and mirrors table padding.
 *
 * Date Created: 2025-November-07
 * Author: thangtruong
 */

interface TasksTableHeaderProps {
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onRowsPerPageChange: (value: number) => void;
}

const TasksTableHeader = ({ rowsPerPage, rowsPerPageOptions, onRowsPerPageChange }: TasksTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4 px-2 lg:px-2">
      <h2 className="text-2xl font-bold text-gray-800">List View: All Tasks</h2>
      <div className="flex items-center space-x-2">
        <label htmlFor="rowsPerPage" className="text-sm font-medium text-gray-700">
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          className="px-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TasksTableHeader;

