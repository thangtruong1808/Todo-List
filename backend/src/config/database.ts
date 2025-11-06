/**
 * Database Configuration
 * 
 * Description: MySQL database connection pool configuration using environment variables.
 *              Handles database connection settings for local or remote MySQL databases.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
// If DB_PASSWORD is not set or is empty string, use undefined (no password)
// Otherwise use the provided password value
const dbPassword = process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '' 
  ? process.env.DB_PASSWORD.trim() 
  : undefined;

// Database connection pool configuration
// Default values match XAMPP MySQL setup: localhost, root user, no password, port 3308
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: dbPassword,
  database: process.env.DB_NAME || 'todoList_db',
  port: parseInt(process.env.DB_PORT || '3308', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

