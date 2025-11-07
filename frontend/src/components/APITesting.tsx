/**
 * API Testing Component
 * 
 * Description: API Testing page component that guides users on how to test API endpoints.
 *              Implementation will be added later.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useMemo } from 'react';

// List of tools that can be used to exercise the backend APIs.
const apiTools = [
  {
    name: 'Postman',
    description: 'Import the collection and send authenticated requests with ease.',
    url: 'https://www.postman.com/downloads/',
  },
  {
    name: 'Insomnia',
    description: 'Lightweight REST client with environment support and scripting.',
    url: 'https://insomnia.rest/download',
  },
  {
    name: 'cURL (CLI)',
    description: 'Great for quick testing from the terminal or CI pipelines.',
    url: 'https://curl.se/download.html',
  },
];

// Common headers required when hitting authenticated endpoints.
const defaultHeaders = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Accept', value: 'application/json' },
];

const APITesting = () => {
  // Compute sample requests once to avoid re-creation on re-render.
  const sampleRequests = useMemo(
    () => [
      {
        title: 'Create a Task',
        method: 'POST',
        path: '/api/tasks',
        body: JSON.stringify({
          title: 'New Task',
          taskcode: 'A1234',
          description: 'Optional task description',
          status: 'Pending',
          due_date: new Date().toISOString(),
        }, null, 2),
        description: 'Creates a new task record with the provided details.',
      },
      {
        title: 'List All Tasks',
        method: 'GET',
        path: '/api/tasks',
        body: undefined,
        description: 'Returns an array of all tasks stored in the database.',
      },
      {
        title: 'Update Task Status',
        method: 'PUT',
        path: '/api/tasks/:id',
        body: JSON.stringify({
          status: 'In Progress',
        }, null, 2),
        description: 'Update the status of a task by replacing :id with the task ID.',
      },
      {
        title: 'Delete a Task',
        method: 'DELETE',
        path: '/api/tasks/:id',
        body: undefined,
        description: 'Remove a task permanently. Replace :id with the target task ID.',
      },
    ],
    [],
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

