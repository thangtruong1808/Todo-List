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