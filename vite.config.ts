import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',                        // ✅ Use project root so index.html is outside src
  base: '/InteriorDesignerStudio/', // ✅ GitHub Pages base path
  build: {
    target: 'ES2020',
    outDir: 'dist',                 // ✅ Build output folder
    emptyOutDir: true               // ✅ Clear dist before each build
  },
  server: {
    port: 5173,
    open: true
  }
});