/**
 * Description: API Configuration for HTTP requests to the backend server.
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import axios from 'axios';

// Used for Serverless database on Hostinger Provider
const baseURL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_LOCAL; 
  
// Used for Local database
// const baseURL = import.meta.env.VITE_API_LOCAL_BASE_URL; // Local base URL

// const baseURL = "http://localhost:5000/api"; // Local base URL

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

