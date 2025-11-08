/**
 * Description: MySQL connection pool configuration sourced from environment variables.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load .env values into process.env

const dbHost = process.env.DB_HOST!.trim(); // Database host name / IP
const dbUser = process.env.DB_USER!.trim(); // Database user credential
// const dbPassword = process.env.DB_PASSWORD!.trim(); // Database password credential
const dbPassword = process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '' 
  ? process.env.DB_PASSWORD.trim() 
  : undefined; // Database password 
const dbName = process.env.DB_NAME!.trim(); // Target schema

const dbPortRaw = process.env.DB_PORT!.trim(); // Port string to parse
const dbPort = Number(dbPortRaw);
if (Number.isNaN(dbPort)) {
  throw new Error('[Database Config] DB_PORT must be a valid number.'); // Guard invalid port
}

const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  dateStrings: ['DATE', 'DATETIME', 'TIMESTAMP'], // Preserve database time strings for consistent display and updates
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool; // Shared connection pool across backend

