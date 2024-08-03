import axios from 'axios';
export const HOST = import.meta.env.VITE_HOST || "http://localhost:5000";
export const API = axios.create({
  baseURL: `${HOST}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers = req.headers || {}; // Ensure req.headers is defined
    req.headers['Authorization'] = `Bearer ${token}`;
  }
  return req;
});

export const Logout = () => {
  localStorage.removeItem('token');
  window.location.reload();
};
