/**
 * URLs base de cada microservicio del backend.
 *
 * Hoy no se usan (todas las páginas de admin consumen mocks), pero quedan
 * listas para el día que se conecten los microservicios reales: cada
 * feature ya importa la suya desde acá en su archivo `services/*.ts`.
 *
 * Configurar en un archivo `.env` (ver `.env.example`) con, por ejemplo:
 *   VITE_USERS_API_URL=https://api.despescar.com/users
 */
export const API_CONFIG = {
  usersServiceUrl: import.meta.env.VITE_USERS_API_URL ?? '/api/users',
  flightsServiceUrl: import.meta.env.VITE_FLIGHTS_API_URL ?? '/api/flights',
  bookingsServiceUrl: import.meta.env.VITE_BOOKINGS_API_URL ?? '/api/bookings',
  reportsServiceUrl: import.meta.env.VITE_REPORTS_API_URL ?? '/api/reports',
};
