/**
 * Description: Landing page summarizing benefits and navigation shortcuts.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Link } from 'react-router-dom';

// Feature highlights for hero
const featureHighlights = [
  {
    title: 'Stay Organized Effortlessly',
    description: 'Group tasks by status, spot overdue items instantly, and focus on what matters most.',
  },
  {
    title: 'Melbourne Time Awareness',
    description: 'All due dates align with Melbourne time so distributed teams stay perfectly synchronized.',
  },
  {
    title: 'Flexible Views',
    description: 'Switch between table and Kanban layouts to manage tasks the way your team prefers.',
  },
  {
    title: 'Smart Automations',
    description: 'Automatic overdue detection keeps the board accurate without manual effort.',
  },
];

// Quick navigation targets
const quickNavigation = [
  {
    label: 'Manage Tasks with List View for better readability',
    description: 'Create, edit, and monitor every task from a single dashboard.',
    to: '/tasks',
  },
  {
    label: 'Kanban View board for better visualization',
    description: 'Drag and drop tasks between columns to reflect real-time progress.',
    to: '/view-tasks',
  },
  {
    label: 'API Testing to verify the backend endpoints',
    description: 'Explore backend endpoints and verify integrations quickly.',
    to: '/api-testing',
  },
];

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero summary */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Welcome to Todo List App
        </h1>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg leading-relaxed">
            A modern and intuitive task management application designed to help you stay organized and productive.
          </p>
          <p className="text-lg leading-relaxed">
            This full-stack application is built with Tailwind CSS, React, TypeScript, Express.js, and MySQL serverless, providing a seamless experience for managing your daily tasks and to-do items.
          </p>
          <p className="text-lg leading-relaxed">
            Get started by creating your first task and experience the power of efficient task management!
          </p>
        </div>
      </div>

      {/* Feature highlights */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Why teams choose this workspace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureHighlights.map((feature) => (
            <div key={feature.title} className="border border-gray-100 rounded-lg p-5 hover:shadow-sm transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick navigation */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Jump back into work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickNavigation.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="border border-gray-100 rounded-lg p-5 hover:border-blue-500 hover:shadow transition duration-200 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{item.description}</p>
              </div>
              <span className="text-blue-600 text-sm font-medium">Open &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Call-to-action */}
      <section className="bg-blue-50 rounded-lg border border-blue-100 p-8 text-center">
        <h2 className="text-2xl font-semibold text-blue-900 mb-3">Ready to streamline your workflow?</h2>
        <p className="text-blue-800 mb-6">
          Create tasks, collaborate with your team, and keep every deadline in sight.
        </p>
        <Link
          to="/tasks"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Tasks Management
        </Link>
      </section>
    </div>
  );
};

export default Home;

