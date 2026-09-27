import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/auth/register') || config.url?.includes('/auth/login')) {
      return config;
    }

    const { tokens } = useAuthStore.getState();
    if (tokens?.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> =
  [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/register')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { user, tokens, login, logout } = useAuthStore.getState();

      try {
        if (!tokens?.refreshToken) {
          logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post('http://localhost:8080/auth/refresh', {
          refreshToken: tokens.refreshToken,
        });

        const newToken = refreshResponse.data;

        if (user) {
          login(newToken.accessToken, user);
        }

        processQueue(null, newToken.accessToken);
        isRefreshing = false;

        originalRequest.headers['Authorization'] = `Bearer ${newToken.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
