/**
 * Footer Component
 * 
 * Description: Footer component for the Todo List application.
 *              Displays app logo/title with description, social media links, author information, quick links, and tech stack.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { Link } from 'react-router-dom';
import { FaListCheck } from 'react-icons/fa6';
import { FaLinkedin, FaGithub, FaFacebook, FaGlobe } from 'react-icons/fa';
import authorPhoto from '../assets/images/thangtruong.jpg';

const Footer = () => {
  // App information - application name and description
  const appName = 'Todo List App';
  const appDescription = 'A modern and intuitive task management application designed to help you stay organized and productive.';

  // Author information from environment variables - social media links
  const authorName = import.meta.env.VITE_DEVELOPER_NAME || '';
  const linkedinUrl = import.meta.env.VITE_DEVELOPER_LINKEDIN_URL || '#';
  const githubUrl = import.meta.env.VITE_DEVELOPER_GITHUB_URL || '#';
  const facebookUrl = import.meta.env.VITE_DEVELOPER_FACEBOOK_URL || '#';

  // Navigation items for quick links - footer navigation menu
  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/view-tasks', label: 'View Tasks' },
    { path: '/api-testing', label: 'API Testing' },
    { path: '/about', label: 'About' },
  ];

  // Tech stack - technologies used in the application
  const techStack = [
    'React 18.2.0',
    'TypeScript 5.3.3',
    'Vite 5.0.8',
    'Tailwind CSS 3.4.0',
    'React Router DOM 7.9.5',
    'Axios 1.6.2',
    'React Hook Form 7.48.2',
    '@hello-pangea/dnd 16.2.1',
    'React Icons 5.5.0',
    'Express.js 4.18.2',
    'cors 2.8.5',
    'dotenv 16.3.1',
    'mysql2 3.6.5',
  ];

  return (
    <footer className="bg-white shadow-md mt-auto border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* App Logo/Title Section - Clickable to navigate to Home */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              to="/"
              className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            >
              <FaListCheck className="text-blue-600 text-2xl" />
              <h3 className="text-lg font-bold text-gray-800">{appName}</h3>
            </Link>
            <p className="text-xs text-gray-600 text-center md:text-left">
              {appDescription}
            </p>
          </div>

          {/* Social Media & Author Section */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm font-semibold text-gray-800 mb-3">Follow Us</p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mb-4">
              {linkedinUrl && linkedinUrl !== '#' && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin className="text-xl" />
                </a>
              )}
              {githubUrl && githubUrl !== '#' && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-900 transition-colors duration-200"
                  aria-label="GitHub Profile"
                >
                  <FaGithub className="text-xl" />
                </a>
              )}
              {facebookUrl && facebookUrl !== '#' && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800 transition-colors duration-200"
                  aria-label="Facebook Profile"
                >
                  <FaFacebook className="text-xl" />
                </a>
              )}
            </div>
            {/* Author Information */}
            <div className="flex items-center gap-3">
              <img
                src={authorPhoto}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{authorName}</p>
                <p className="text-xs text-gray-600">Full-stack Developer</p>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm font-semibold text-gray-800 mb-3">Quick Links</p>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm font-semibold text-gray-800 mb-2">Tech Stack</p>
            <p className="text-xs text-gray-600 text-center md:text-left">
              {techStack.map((tech) => (
                <span key={tech}>
                  {' • '}
                  {tech}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Deployment Information Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2">
            <FaGlobe className="text-blue-500 text-sm animate-pulse" />
            <p className="text-xs text-gray-600">
              This app has been deployed to{' '}
              <span className="text-blue-600 font-semibold">Vercel</span> and is{' '}
              <span className="text-green-600 font-semibold">live</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

