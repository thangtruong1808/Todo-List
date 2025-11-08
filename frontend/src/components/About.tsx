/**
 * Description: About page showcasing setup steps, contribution tips, and author bio.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Link } from 'react-router-dom';
import authorPhoto from '../assets/images/thangtruong.jpg';

const githubUrl = import.meta.env.VITE_AUTHOR_GITHUB_URL || '#'; // GitHub repository link
const repositoryCommand =
  githubUrl === '#'
    ? 'git clone https://github.com/your-org/todo-list.git && cd todo-list'
    : (
      <>
        git clone{' '}
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline underline-offset-2"
        >
          {githubUrl}
        </a>{' '}
        && cd todo-list
      </>
    ); // Clone command with clickable repository URL

// Setup steps for local onboarding.
const projectSetupSteps = [
  {
    title: 'Clone the repository',
    description: 'Use git clone or download the project archive to your machine.',
    command: repositoryCommand,
  },
  {
    title: 'Install dependencies',
    description: 'Install all workspaces in one step from the project root.',
    command: 'npm run install:all',
  },
  {
    title: 'Configure environment variables',
    description: 'Duplicate .env.example files and update database or API credentials.',
    command: `cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env`,
  },
  {
    title: 'Prepare the database',
    description: 'Use MySQL Workbench or phpMyAdmin to run backend/src/database/schema.sql.',
    command: 'Refer to README.md for the detailed walkthrough.',
  },
  {
    title: 'Start development servers',
    description: 'Run both frontend and backend concurrently from the root.',
    command: 'npm run dev',
  },
];

// Tips to align contributions.
const contributionTips = [
  'Follow the established TypeScript and ESLint guidelines before committing changes.',
  'Ensure tasks are tested in both table and Kanban views to catch regressions early.',
  'Update documentation when introducing new environment variables or scripts.',
  'Use descriptive pull request titles summarizing the feature or fix.',
];

const About = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Intro summary */}
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Build the Todo List Project Locally</h1>
        <p className="text-gray-600">
          Follow the procedures below to get the full-stack application running from scratch.
        </p>
      </div>

      {/* Setup checklist */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project Setup Steps</h2>
        <ol className="space-y-6">
          {projectSetupSteps.map((step, index) => (
            <li key={step.title} className="border border-gray-100 rounded-lg p-5">
              <header className="flex items-start gap-4">
                <span className="text-blue-600 text-xl font-semibold">{index + 1}.</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </header>
              {step.command && (
                <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 font-mono whitespace-pre-wrap break-words mt-4">
                  {step.command}
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Contribution tips */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contribution Guidelines</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          {contributionTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Author spotlight */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={authorPhoto}
            alt="thangtruong"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow"
          />
          <div className="text-center md:text-left space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">Meet Thang.Truong</h2>
            <p className="text-sm text-gray-600">
              Full-stack developer behind this Todo List platform, focused on building reliable workflow tools with seamless user experiences.
            </p>
            <p className="text-sm text-gray-600">
              Passionate about Tailwind CSS, TypeScript, React.js, Express.js, MySQL, and crafting thoughtful frontend interactions that keep teams aligned.
            </p>
          </div>
        </div>
      </section>

      {/* Quick navigation */}
      <section className="bg-blue-50 rounded-lg border border-blue-100 p-8 text-center">
        <h2 className="text-2xl font-semibold text-blue-900 mb-3">Need more details?</h2>
        <p className="text-blue-800 mb-6">Visit the sections below to explore APIs or manage tasks once setup is complete.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/api-testing"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            API Testing Guide
          </Link>
          <Link
            to="/tasks"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
          >
            Go to Tasks Management
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

