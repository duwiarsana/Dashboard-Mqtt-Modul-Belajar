import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',  // Pastikan base path di-set ke root
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',  // Tambahkan ini untuk menerima koneksi dari luar
    open: true,
  },
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Tambahkan chunk size warning yang lebih besar
    chunkSizeWarningLimit: 1000,
    // Optimasi chunking
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mqtt: ['mqtt'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['mqtt'],
  },
});
