import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Запросы идут через тот же origin, что и страница, поэтому HttpOnly-cookie
// с refresh token работает без настройки CORS.
const proxy = { '/api': 'http://127.0.0.1:8000' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
