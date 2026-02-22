import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true,
});

// Attach Authorization header to every request if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('kodbank_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If we get a 401 response, clear the stored token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('kodbank_token');
        }
        return Promise.reject(error);
    }
);

export default api;
