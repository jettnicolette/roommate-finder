import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/users': 'http://localhost:5000',
      '/habits': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
      '/locations': 'http://localhost:5000',
      '/matches': 'http://localhost:5000',
    }
  }
})