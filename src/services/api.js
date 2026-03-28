// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Tự động gắn accessToken vào mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken'); // 👈 Xóa token cũ
            window.location.href = '/login';        // 👈 Redirect về login (bỏ comment)
        }

        return Promise.reject(error);
    }
);