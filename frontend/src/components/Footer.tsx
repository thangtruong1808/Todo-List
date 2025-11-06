/**
 * Footer Component
 * 
 * Description: Footer component for the Todo List application.
 *              Displays copyright information and application details.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */


const Footer = () => {
  // Get current year for copyright display
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Todo List App. All rights reserved.
            </p>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-400">
            <p>Built with React, TypeScript & Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

