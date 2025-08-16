import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    open: true
  },
  preview: {
    port: 3000,
    open: true
  }
})
