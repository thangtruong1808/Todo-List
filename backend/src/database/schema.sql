-- Create database
CREATE DATABASE IF NOT EXISTS todoList_db;

USE todoList_db;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,                       										-- Unique task identifier    
    title VARCHAR(100) NOT NULL,                              									-- Title limited to 100 characters
    description TEXT,                                            								-- Description can be null
    status ENUM('Pending', 'In Progress', 'Completed', 'Archived', 'Overdue') DEFAULT 'Pending',  	
    -- Task status
    taskcode VARCHAR(5) UNIQUE NOT NULL,                        								-- Task code is exactly 5 characters (alphanumeric)
	  due_date DATETIME,  																
  -- Due date field for each task
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Date when the task was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  					
    -- Date when the task was last updated    
);

-- Insert sample data
INSERT INTO tasks (title, description, status, taskcode, due_date)
VALUES
  ('Implement Authentication System', 'Design and implement user authentication using JWT and OAuth2.', 'Pending', 'A0001', '2025-11-30 15:00:00'),
  ('Develop User Dashboard', 'Create a user-friendly dashboard with charts and metrics to visualize data.', 'In Progress', 'A0002', '2025-12-15 10:00:00'),
  ('Refactor Backend Code', 'Refactor the existing backend API to improve performance and scalability.', 'Pending', 'A0003', '2025-12-10 12:00:00'),
  ('Fix Bug in Payment Gateway', 'Resolve issues related to failed payments in the payment gateway integration.', 'Completed', 'A0004', '2025-11-20 14:00:00'),
  ('Create Unit Tests for User Module', 'Write unit tests for the user module to ensure high code quality.', 'Pending', 'A0005', '2025-12-01 16:00:00'),
  ('Set Up CI/CD Pipeline', 'Set up continuous integration and continuous deployment pipeline using Jenkins and Docker.', 'In Progress', 'A0006', '2025-11-25 11:00:00'),
  ('Upgrade Database to Version 5.0', 'Upgrade the database system to the latest stable version with zero downtime.', 'Archived', 'A0007', '2025-11-15 13:00:00'),
  ('Write API Documentation', 'Document the RESTful API with usage examples and authentication guidelines.', 'Pending', 'A0008', '2025-12-05 09:00:00'),
  ('Improve Mobile App Performance', 'Optimize the mobile app to load faster and reduce latency.', 'In Progress', 'A0009', '2025-12-12 17:00:00'),
  ('Implement Dark Mode for Website', 'Add dark mode option to the website for better user experience at night.', 'Completed', 'A0010', '2025-11-18 08:00:00'),
  ('Conduct Security Audit', 'Perform a security audit and fix potential vulnerabilities in the codebase.', 'Pending', 'A0011', '2025-12-07 14:00:00'),
  ('Migrate Legacy Code to TypeScript', 'Convert legacy JavaScript code to TypeScript to improve maintainability.', 'In Progress', 'A0012', '2025-12-20 18:00:00'),
  ('Integrate Payment Gateway', 'Integrate Stripe payment gateway into the platform for seamless payments.', 'Completed', 'A0013', '2025-11-22 19:00:00'),
  ('Implement Logging System', 'Set up a centralized logging system to capture and monitor logs in production.', 'Pending', 'A0014', '2025-12-04 13:00:00'),
  ('Design New Landing Page', 'Create a visually appealing and responsive landing page for product promotion.', 'Archived', 'A0015', '2025-11-14 10:00:00'),
  ('Develop Admin Panel', 'Develop an admin panel for managing users and content on the platform.', 'In Progress', 'A0016', '2025-12-22 09:00:00'),
  ('Fix UI Bug in Checkout Page', 'Fix the UI bug on the checkout page that affects the order summary layout.', 'Completed', 'A0017', '2025-11-25 11:00:00'),
  ('Enhance Search Functionality', 'Improve search functionality to support fuzzy matching and autocomplete.', 'Pending', 'A0018', '2025-12-10 13:00:00'),
  ('Deploy Staging Environment', 'Deploy the latest build to the staging environment for testing before production.', 'In Progress', 'A0019', '2025-12-02 12:00:00'),
  ('Update Documentation for API', 'Update API documentation to include the new endpoints added for user management.', 'Completed', 'A0020', '2025-11-30 16:00:00'),
  ('Implement Notification System', 'Build a system for sending email and push notifications to users.', 'Pending', 'A0021', '2025-12-15 10:00:00'),
  ('Upgrade Frontend Framework to React 18', 'Upgrade the frontend from React 17 to React 18 and make necessary adjustments.', 'In Progress', 'A0022', '2025-12-01 13:00:00'),
  ('Add Search Filters to Product Page', 'Implement search filters for products on the e-commerce website.', 'Completed', 'A0023', '2025-11-30 09:00:00'),
  ('Integrate Google Analytics', 'Add Google Analytics to track user behavior and website performance.', 'Pending', 'A0024', '2025-12-05 14:00:00'),
  ('Build User Profile Page', 'Develop a page where users can view and edit their profiles.', 'In Progress', 'A0025', '2025-12-20 17:00:00'),
  ('Optimize Database Queries', 'Optimize SQL queries to improve the performance of data retrieval operations.', 'Completed', 'A0026', '2025-11-18 11:00:00'),
  ('Implement User Permissions', 'Create a user permissions system that allows different access levels.', 'Pending', 'A0027', '2025-12-10 16:00:00'),
  ('Fix Responsive Layout Issue on Mobile', 'Fix layout issues on mobile devices for the homepage and product pages.', 'Archived', 'A0028', '2025-11-25 08:00:00'),
  ('Implement Data Import Feature', 'Build functionality to import data from CSV and Excel files into the application.', 'In Progress', 'A0029', '2025-12-12 18:00:00'),
  ('Develop RESTful API for User Management', 'Create a REST API for managing user data including registration, login, and profile updates.', 'Completed', 'A0030', '2025-11-22 15:00:00'),
  ('Refactor Frontend Codebase', 'Refactor the frontend code to improve maintainability and scalability.', 'Pending', 'A0031', '2025-12-03 10:00:00'),
  ('Set Up Cloud Storage for Media Files', 'Configure and set up cloud storage (e.g., AWS S3) for storing media files uploaded by users.', 'In Progress', 'A0032', '2025-12-18 13:00:00'),
  ('Create Data Backup System', 'Implement an automatic data backup system to ensure system recovery during failure.', 'Completed', 'A0033', '2025-11-28 14:00:00'),
  ('Add Multi-language Support', 'Integrate multi-language support into the platform to serve users globally.', 'Pending', 'A0034', '2025-12-07 12:00:00'),
  ('Integrate Social Media Login', 'Allow users to log in using their social media accounts such as Facebook, Google, etc.', 'In Progress', 'A0035', '2025-12-21 11:00:00'),
  ('Fix Critical Bug in Checkout Process', 'Resolve the critical bug that causes checkout failure in the payment process.', 'Completed', 'A0036', '2025-11-23 14:00:00'),
  ('Add Email Confirmation for New Users', 'Implement email confirmation for users who register on the platform.', 'Archived', 'A0037', '2025-11-19 10:00:00'),
  ('Optimize Image Loading on Website', 'Implement lazy loading and compression for images to improve page load times.', 'Pending', 'A0038', '2025-12-09 13:00:00'),
  ('Create Admin Role for Managing Content', 'Develop an admin role with permissions to manage website content and user accounts.', 'In Progress', 'A0039', '2025-12-25 10:00:00'),
  ('Deploy Website to Production', 'Deploy the website from the staging environment to production and monitor the deployment.', 'Completed', 'A0040', '2025-11-26 17:00:00');
