import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfig from 'vite-jsconfig-paths'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfig()],
})
