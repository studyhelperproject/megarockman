import { defineConfig } from 'vite';

export default defineConfig({
  base: '/megarockman/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
});
