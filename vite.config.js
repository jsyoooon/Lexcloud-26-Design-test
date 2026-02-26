import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false, // 만약 5173 포트가 사용 중이면 자동으로 다음 포트(5174 등)를 사용합니다.
  }
})
