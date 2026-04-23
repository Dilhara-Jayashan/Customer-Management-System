import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }
    if (error.response?.status === 409) {
      return Promise.reject(new Error('Duplicate NIC number. Please use a unique NIC number.'));
    }
    if (error.response?.status === 400) {
      return Promise.reject(new Error(error.response?.data?.message || 'Invalid request'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8080'));
    }
    return Promise.reject(error);
  }
);

export default api;
