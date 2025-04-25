import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
if (!BASE_URL) {
  throw new Error(
    'Missing NEXT_PUBLIC_API_URL in .env.local — check that file exists and you restarted the dev server'
  );
}

console.log('[utils/api] ➜ using baseURL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
});

export default api;
