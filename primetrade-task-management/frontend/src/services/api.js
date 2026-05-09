import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/v1/auth/register', data),
  login: (data) => api.post('/v1/auth/login', data),
};

// Task API
export const taskAPI = {
  create: (data) => api.post('/v1/tasks', data),
  getMyTasks: (page = 0, size = 9) =>
    api.get(`/v1/tasks/my?page=${page}&size=${size}&sort=createdAt,desc`),
  getAllTasks: (page = 0, size = 9) =>
    api.get(`/v1/tasks/all?page=${page}&size=${size}&sort=createdAt,desc`),
  getById: (id) => api.get(`/v1/tasks/${id}`),
  update: (id, data) => api.put(`/v1/tasks/${id}`, data),
  delete: (id) => api.delete(`/v1/tasks/${id}`),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/v1/admin/users'),
  getStats: () => api.get('/v1/admin/stats'),
};

export default api;