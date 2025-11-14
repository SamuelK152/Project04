import axios from 'axios';

const base =
  import.meta.env.MODE === 'development'
    ? '/api'
    : 'https://your-service.onrender.com/api'; // replace with your Render URL

const api = axios.create({ baseURL: base });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;