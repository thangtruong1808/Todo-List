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

// API base URL - backend server endpoint
const baseURL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

