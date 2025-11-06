/**
 * NavBar Component
 * 
 * Description: Responsive navigation bar component for the Todo List application.
 *              Displays the application logo/title with icon and navigation links.
 *              Includes mobile hamburger menu for smaller screens.
 *              Uses React Router for URL-based navigation.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaListCheck } from 'react-icons/fa6';
import { HiMenu, HiX } from 'react-icons/hi';

const NavBar = () => {
  // Get current location for active link highlighting
  const location = useLocation();
  // Ref to reference the navigation element
  const navRef = useRef<HTMLElement>(null);

  // State to control mobile navigation menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu open/close state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if current path matches the link path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav ref={navRef} className="bg-white shadow-md ">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title with Icon - Clickable to navigate to Home */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          >
            <FaListCheck className="text-blue-600 text-xl md:text-2xl" />
            <h1 className="text-lg md:text-2xl font-bold text-blue-600">
              <span className="hidden sm:inline">Todo List App</span>
              <span className="sm:hidden">Todo App</span>
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`transition-colors duration-200 ${isActive('/')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              Home
            </Link>
            <Link
              to="/tasks"
              className={`transition-colors duration-200 ${isActive('/tasks')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              Tasks
            </Link>
            <Link
              to="/view-tasks"
              className={`transition-colors duration-200 ${isActive('/view-tasks')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              View Tasks
            </Link>
            <Link
              to="/api-testing"
              className={`transition-colors duration-200 ${isActive('/api-testing')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              API Testing
            </Link>
            <Link
              to="/about"
              className={`transition-colors duration-200 ${isActive('/about')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="text-3xl border border-gray-300 rounded p-1 hover:border-blue-600 transition-colors duration-200" />
            ) : (
              <HiMenu className="text-3xl border border-gray-300 rounded p-1 hover:border-blue-600 transition-colors duration-200" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? 'max-h-80 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          <div className="flex flex-col space-y-4 py-4 border-t border-gray-200">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`text-left transition-colors duration-200 px-2 py-1 ${isActive('/')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              Home
            </Link>
            <Link
              to="/tasks"
              onClick={closeMobileMenu}
              className={`text-left transition-colors duration-200 px-2 py-1 ${isActive('/tasks')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              Tasks
            </Link>
            <Link
              to="/view-tasks"
              onClick={closeMobileMenu}
              className={`text-left transition-colors duration-200 px-2 py-1 ${isActive('/view-tasks')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              View Tasks
            </Link>
            <Link
              to="/api-testing"
              onClick={closeMobileMenu}
              className={`text-left transition-colors duration-200 px-2 py-1 ${isActive('/api-testing')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              API Testing
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className={`text-left transition-colors duration-200 px-2 py-1 ${isActive('/about')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
                }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

