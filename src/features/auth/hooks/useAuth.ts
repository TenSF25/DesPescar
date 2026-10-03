import { useState } from 'react';
import type { errorAuth, InterfaceAuth } from '../auth.types';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { api, gatewayBaseUrl } from '@/config/api';
import axios from 'axios';
import { getHomeForRole } from '@/features/admin/roles';

export const useAuth = () => {
  const [errorAuth, setErrAuth] = useState<errorAuth>();
  const navigate = useNavigate();

  const executeRegister = async (datos: InterfaceAuth) => {
    setErrAuth(undefined);

    try {
      const res = await api.post(`${gatewayBaseUrl}/api/auth/register`, datos);
      navigate('/login');
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrAuth(err.response?.data as errorAuth);
      }
    }
  };

  const currentUser = async () => {
    try {
      const res = await api.get(`${gatewayBaseUrl}/api/users/me`);
      const dataJson = await res.data;
      return dataJson;
    } catch (err: unknown) {
      console.error('Error al obtener el usuario actual', err);
      throw err;
    }
  };

  const executeLogin = async (datos: InterfaceAuth) => {
    setErrAuth(undefined);

    try {
      const res = await api.post(`${gatewayBaseUrl}/api/auth/login`, datos);
      const tokens = await res.data;
      useAuthStore.setState({ tokens });
      const userData = await currentUser();
      const { login } = useAuthStore.getState();
      login(tokens, userData);
      navigate(getHomeForRole(userData.role));
      return tokens;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrAuth(err.response?.data as errorAuth);
      }
    }
  };

  const clearFieldError = (fieldError: keyof Required<errorAuth>['errors']) => {
    if (!errorAuth?.errors) return;

    setErrAuth((prev) => {
      if (!prev || !prev.errors) return prev;

      const updateErrors = { ...prev.errors };
      delete updateErrors[fieldError];

      return {
        ...prev,
        errors: updateErrors,
      };
    });
  };

  return {
    executeRegister,
    executeLogin,
    currentUser,
    errorAuth,
    clearFieldError,
  };
};
