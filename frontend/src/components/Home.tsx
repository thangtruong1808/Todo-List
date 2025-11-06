/**
 * Home Component
 * 
 * Description: Home page component that displays welcome message and app description.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Welcome to Todo List App
        </h1>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg leading-relaxed">
            A modern and intuitive task management application designed to help you stay organized and productive.
          </p>
          <p className="text-lg leading-relaxed">
            This full-stack application is built with React, TypeScript, Express.js, and MySQL, providing a seamless experience for managing your daily tasks and to-do items.
          </p>
          <p className="text-lg leading-relaxed">
            Get started by creating your first task and experience the power of efficient task management!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

