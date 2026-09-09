export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const buildUrl = (baseUrl: string, path: string, params?: ApiRequestOptions['params']) => {
  const url = new URL(path, window.location.origin + baseUrl.replace(/\/?$/, '/'));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

/**
 * Wrapper fino sobre `fetch`, pensado para usarse una vez que cada
 * microservicio esté disponible. Uso esperado dentro de un `services/*.ts`
 * de feature:
 *
 *   import { apiRequest } from '../../../services/apiClient';
 *   import { API_CONFIG } from '../../../services/apiConfig';
 *
 *   export const getUsers = () =>
 *     apiRequest<AdminUser[]>(API_CONFIG.usersServiceUrl, '/usuarios');
 *
 *   export const deleteFlight = (id: string) =>
 *     apiRequest<void>(API_CONFIG.flightsServiceUrl, `/vuelos/${id}`, { method: 'DELETE' });
 */
export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { params, headers, body, ...rest } = options;

  const response = await fetch(buildUrl(baseUrl, path, params), {
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Error ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
