import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('./src', import.meta.url)),
  appType: 'mpa',
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': process.env.API_TARGET || 'http://127.0.0.1:3000',
    },
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(['index', 'zipper', 'fetch'].map(name => [
        name, fileURLToPath(new URL(`./src/${name}.html`, import.meta.url)),
      ])),
    },
  },
});
