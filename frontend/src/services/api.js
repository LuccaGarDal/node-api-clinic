import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/', // Adjust the base URL as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming you store the JWT in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } 

  return config;
});

export default api;