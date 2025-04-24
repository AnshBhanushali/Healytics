// utils/api.ts
import axios, { AxiosInstance } from 'axios';

const defaultBaseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : '';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || defaultBaseURL;

// <-- add this
console.log('[utils/api] ➜ using baseURL:', API_BASE_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
});

export default api;
