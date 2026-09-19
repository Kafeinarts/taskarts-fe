import axios from 'axios';

/**
 * boot/axios.js
 *
 * Centralized HTTP client for all API calls to the Laravel backend.
 * - Local dev: proxy /api/v1 → http://127.0.0.1:8000 (via vue.config.js)
 * - Production: set VUE_APP_API_BASE_URL to backend domain
 *
 * Every request/response is logged to console with [API] prefix
 * for easy Network tab + Console tracing.
 */

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — attach Bearer token + log
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ft_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log outgoing request for tracing
    console.log(
      `%c[API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      'color: #6366f1; font-weight: bold;',
      token ? '(has token)' : '(no token)',
    );
    return config;
  },
  (error) => {
    console.error('[API] Request setup error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor — log + handle global 401
api.interceptors.response.use(
  (response) => {
    console.log(
      `%c[API] ✓ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      'color: #22c55e;',
      response.data?.message || '',
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || '???';

    if (error.code === 'ECONNABORTED') {
      console.error(`[API] ✗ TIMEOUT ${method} ${url} — server tidak merespons dalam 30 detik`);
    } else if (!error.response) {
      console.error(`[API] ✗ NETWORK ERROR ${method} ${url} —`, error.message, '(server mungkin belum running)');
    } else {
      console.error(
        `[API] ✗ ${status} ${method} ${url}`,
        error.response.data?.message || error.response.statusText,
      );
    }

    // Global 401 handler: if any API (except /auth/me) returns 401, clear auth
    // /auth/me is handled separately by fetchUser in store
    if (status === 401 && !url.includes('/auth/me')) {
      console.warn(`[Auth] 401 on ${method} ${url} — clearing session`);
      localStorage.removeItem('ft_auth_token');
      localStorage.removeItem('ft_auth_user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        console.warn('[Auth] Redirecting to /login');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
