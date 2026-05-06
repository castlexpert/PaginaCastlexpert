import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Sirve igual en localhost y 127.0.0.1 (evita fallback HTML para estáticos por validación de host).
    host: true,
    allowedHosts: 'all',
    proxy: {
      '/api': 'http://localhost:3000',
      '/media-sitio': 'http://localhost:3000',
    },
  },
});
