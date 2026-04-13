import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  async (response) => {
    // Log to devtools store
    const { useDevToolsStore } = await import('@/store/devToolsStore');
    const store = useDevToolsStore.getState();
    store.addApiLog({
      method: response.config.method?.toUpperCase() ?? 'GET',
      path: response.config.url ?? '',
      status: response.status,
      duration_ms: 0,
      timestamp: new Date().toISOString(),
      cache_hit: null,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
