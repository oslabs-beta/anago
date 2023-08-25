///<reference types="vitest"/>
///<reference types="vite/client"/>

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { types } from 'sass';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './client/__tests__/setup.ts',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        secure: false,
      },
    },
  },
});
