import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API calls - Autenticación
export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  verify: () => api.get('/auth/verify'),
};

// API calls - Brands
export const brandsApi = {
  getAll: (params) => api.get('/brands', { params }),
  getById: (id) => api.get(`/brands/${id}`),
  getBySlug: (slug) => api.get(`/brands/slug/${slug}`),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
  activate: (id) => api.patch(`/brands/${id}/activate`),
};

// API calls - Perfumes
export const perfumesApi = {
  getAll: (params) => api.get('/perfumes', { params }),
  getById: (id) => api.get(`/perfumes/${id}`),
  create: (data) => api.post('/perfumes', data),
  update: (id, data) => api.put(`/perfumes/${id}`, data),
  delete: (id) => api.delete(`/perfumes/${id}`),
  activate: (id) => api.patch(`/perfumes/${id}/activate`),
};

// API calls - Decants
export const decantsApi = {
  getAll: (params) => api.get('/decants', { params }),
  getById: (id) => api.get(`/decants/${id}`),
  create: (data) => api.post('/decants', data),
  update: (id, data) => api.put(`/decants/${id}`, data),
  delete: (id) => api.delete(`/decants/${id}`),
  activate: (id) => api.patch(`/decants/${id}/activate`),
};

// API calls - Images
export const imagesApi = {
  upload: (formData) => api.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: (folder) => api.get('/images/list', { params: { folder } }),
  listFolders: () => api.get('/images/folders'),
  delete: (filename, folder) => api.delete(`/images/${filename}`, { params: { folder } }),
};

export default api;






