import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Green-api-test-max/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
