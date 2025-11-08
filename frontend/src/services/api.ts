/**
 * API Configuration
 * 
 * Description: Axios instance configuration for API calls.
 *              Sets base URL and default headers for all HTTP requests.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import axios from 'axios';

// Used for Serverless database on Hostinger Provider
const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; 
  
// Used for Local database
// const baseURL = 'http://localhost:5000/api'; // Local base URL
  

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

