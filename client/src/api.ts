import axios from 'axios';

// In production, API calls go through Vercel's proxy rewrite (same domain = no cookie issues)
// In development, calls go directly to localhost:5000
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true,
});

export default api;

