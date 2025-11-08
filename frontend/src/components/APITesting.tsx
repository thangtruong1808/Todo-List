/**
 * Description: API Testing page component that guides users on how to test API endpoints.
 * Uses environment variables for API endpoints and tool URLs to ensure flexibility.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useMemo } from 'react';

const postmanUrl = import.meta.env.VITE_POSTMAN_URL || '#'; // Postman download page (fallback when env missing)
const insomniaUrl = import.meta.env.VITE_INSOMNIA_URL || '#'; // Insomnia download page (fallback when env missing)
const curlUrl = import.meta.env.VITE_CURL_URL || '#'; // cURL download page (fallback when env missing)

// Tool options for exercising backend APIs.
const apiTools = [
  {
    name: 'Postman',
    description: 'Import the collection and send authenticated requests with ease.',
    url: postmanUrl,
  },
  {
    name: 'Insomnia',
    description: 'Lightweight REST client with environment support and scripting.',
    url: insomniaUrl,
  },
  {
    name: 'cURL (CLI)',
    description: 'Great for quick testing from the terminal or CI pipelines.',
    url: curlUrl,
  },
];

// Standard headers for JSON requests.
const defaultHeaders = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Accept', value: 'application/json' },
];

const APITesting = () => {
  const getAllTasksUrl = import.meta.env.VITE_GET_ALL_TASK || '#'; // Endpoint to fetch all tasks
  const getTaskByIdUrl = import.meta.env.VITE_GET_A_TASK_ID || '#'; // Endpoint to retrieve task by ID
  const createTaskUrl = import.meta.env.VITE_POST_A_TASK || '#'; // Endpoint to create new task
  const updateTaskUrl = import.meta.env.VITE_PUT_A_TASK_ID || '#'; // Endpoint to update task by ID
  const deleteTaskUrl = import.meta.env.VITE_DELETE_A_TASK_ID || '#'; // Endpoint to delete task by ID

  // Prepare illustrative request snippets.
  const sampleRequests = useMemo(
    () => [
      {
        // POST /tasks example
        title: 'Create a Task',
        method: 'POST',
        path: createTaskUrl,
        body: JSON.stringify(
          {
            title: 'This is a sample Test Task 1',
            description: 'This is a sample test task description 1',
            status: 'Pending',
            taskcode: 'TT001',
            due_date: '2025-12-31T23:59:59',
          },
          null,
          2,
        ),
        description: 'Creates a new task record with predefined demo values.',
      },
      {
        // GET /tasks example
        title: 'List All Tasks',
        method: 'GET',
        path: getAllTasksUrl,
        body: undefined,
        description: 'Returns an array of all tasks stored in the database.',
      },
      {
        // GET /tasks/:id example
        title: 'Get Task By ID',
        method: 'GET',
        path: getTaskByIdUrl,
        body: undefined,
        description: 'Retrieve the task with ID 1 for inspection.',
      },
      {
        // PUT /tasks/:id example
        title: 'Update Task Status',
        method: 'PUT',
        path: updateTaskUrl,
        body: JSON.stringify(
          {
            status: 'In Progress',
          },
          null,
          2,
        ),
        description: 'Update the status of task ID 1 to "In Progress".',
      },
      {
        // DELETE /tasks/:id example
        title: 'Delete a Task',
        method: 'DELETE',
        path: deleteTaskUrl,
        body: undefined,
        description: 'Remove the task with ID 1 from the database.',
      },
    ],
    [createTaskUrl, getAllTasksUrl, getTaskByIdUrl, updateTaskUrl, deleteTaskUrl],
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header introducing the API playground */}
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">API Testing Playground</h1>
        <p className="text-gray-600">
          Use the sections below to explore backend endpoints with your favorite API client.
        </p>
      </div>

      {/* Tool suggestions to help testers get started */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {apiTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-100 rounded-lg p-5 hover:shadow transition duration-200 text-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{tool.name}</h3>
              <p className="text-sm leading-relaxed">{tool.description}</p>
              <span className="text-blue-600 text-sm font-medium inline-block mt-4">Download &rarr;</span>
            </a>
          ))}
        </div>
      </section>

      {/* Default headers to include in requests */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Request Headers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Header</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {defaultHeaders.map((header) => (
                <tr key={header.key}>
                  <td className="px-4 py-2 text-sm text-gray-700 font-medium">{header.key}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{header.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sample requests with method, path, and payload */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sample Requests</h2>
        <div className="space-y-6">
          {sampleRequests.map((sample) => (
            <div key={sample.title} className="border border-gray-100 rounded-lg p-5">
              <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{sample.title}</h3>
                  <p className="text-sm text-gray-600">{sample.description}</p>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block">
                  {sample.method}
                </span>
              </header>
              <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words">{`fetch('${sample.path}', {
  method: '${sample.method}',
  headers: ${JSON.stringify(defaultHeaders.reduce((acc, header) => ({
                  ...acc,
                  [header.key]: header.value,
                }), {}), null, 2)},${sample.body ? `
  body: ${sample.body},` : ''}
});`}</pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips to ensure successful testing sessions */}
      <section className="bg-blue-50 rounded-lg border border-blue-100 p-8">
        <h2 className="text-2xl font-semibold text-blue-900 mb-3">Testing Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-blue-900 text-sm">
          <li>Ensure the backend server is running locally on port 4000 before sending requests.</li>
          <li>Use environment variables in your client (Postman/Insomnia) for base URLs and tokens.</li>
          <li>Verify database migrations are applied so the tasks table matches expected schema.</li>
          <li>Log responses in your client to confirm status codes and payload structures.</li>
        </ul>
      </section>
    </div>
  );
};

export default APITesting;

