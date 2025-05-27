import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      timeout: 120000
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/rest/v1': {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/rest\/v1/, '/rest/v1')
      },
      '/auth/v1': {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/auth\/v1/, '/auth/v1')
      },
      '/storage/v1': {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/storage\/v1/, '/storage/v1')
      }
    }
  }
})