import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: '/InteriorDesignerStudio/',
  build: {
    target: 'ES2020',
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        project: resolve(__dirname, 'project.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})