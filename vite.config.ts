import { defineConfig } from 'vite'

export default defineConfig({
  base: '/InteriorDesignerStudio/',  
  build: {
    target: 'ES2020',
    outDir: 'dist'
  },
  server: {
    port: 5173,
    open: true
  }
})