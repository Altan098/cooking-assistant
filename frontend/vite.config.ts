import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Запросы идут через тот же origin, что и страница, поэтому HttpOnly-cookie
// с refresh token работает без настройки CORS.
const proxy = { '/api': process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:8000' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
  // Мелкие файлы нельзя встраивать в CSS как data:, иначе шрифты заблокирует CSP на сервере.
  build: { assetsInlineLimit: 0 },
  test: { environment: 'node' },
})
