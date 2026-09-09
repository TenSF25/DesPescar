/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USERS_API_URL?: string;
  readonly VITE_FLIGHTS_API_URL?: string;
  readonly VITE_BOOKINGS_API_URL?: string;
  readonly VITE_REPORTS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
