import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Sin estas variables, src/config/api.ts cae en http/ws de localhost: en dev sirve, en un build no.
const REQUIRED_BUILD_ENV = ['VITE_GATEWAY_URL', 'VITE_WS_URL'];

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    const missing = REQUIRED_BUILD_ENV.filter((name) => !env[name]);
    if (missing.length > 0) {
      throw new Error(
        `Faltan variables de entorno para el build: ${missing.join(', ')}. Copiá .env.example a .env y completalas.`,
      );
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  };
});
