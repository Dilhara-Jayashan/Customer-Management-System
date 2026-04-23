import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 300000, // 5 min for large bulk uploads
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('Cannot connect to server. Ensure backend is running on http://localhost:8080'));
    }
    const status = error.response.status;
    const data   = error.response.data;

    if (status === 400) {
      const msg = data?.message || data?.errors
        ? (data.message || Object.values(data.errors || {}).join(', '))
        : 'Invalid request';
      return Promise.reject(new Error(msg));
    }
    if (status === 404) return Promise.reject(new Error('Resource not found'));
    if (status === 409) return Promise.reject(new Error('Duplicate NIC number — please use a unique NIC.'));
    if (status === 500) return Promise.reject(new Error(data?.message || 'Internal server error'));

    return Promise.reject(error);
  }
);

export default api;
