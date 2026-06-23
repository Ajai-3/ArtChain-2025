import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-slot', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', '@radix-ui/react-switch', '@radix-ui/react-slider', '@radix-ui/react-progress', '@radix-ui/react-radio-group', '@radix-ui/react-checkbox', '@radix-ui/react-avatar', '@radix-ui/react-label', '@radix-ui/react-separator'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority', 'zod', '@hookform/resolvers', 'react-hook-form', 'react-hot-toast'],
          'vendor-charts': ['recharts'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-lucide': ['lucide-react'],
        },
      },
    },
  },
});
