import { EventEmitter } from 'node:events'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

EventEmitter.defaultMaxListeners = 50
process.setMaxListeners(50)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
  },
  esbuild: {
    keepNames: true,
  },
  define: {
    global: 'globalThis',
  },
})
