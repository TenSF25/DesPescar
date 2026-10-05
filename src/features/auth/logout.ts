import axios from 'axios';
import { gatewayBaseUrl } from '@/config/api';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Cierra la sesión: revoca el refresh token en identity-service y limpia el store local.
 * Usa axios directo (no `api`) para que un 401 del logout no dispare el flujo de refresh.
 * Si la llamada falla, la sesión local se cierra igual.
 */
export const logoutSession = () => {
  const { tokens, logout } = useAuthStore.getState();

  if (tokens?.refreshToken) {
    axios
      .post(`${gatewayBaseUrl}/api/auth/logout`, { refreshToken: tokens.refreshToken })
      .catch(() => {});
  }

  logout();
};
