import { defineConfig } from 'vite';
import ReactVite from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    open: true,
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routeFileIgnorePrefix: '-',
    }),
    ReactVite(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: [
          'assets/**/*',
          'fonts/*',
          'images/**/*',
          'favicon.png',
          'index.html',
          'icons/**/*',
          'placeholders/**/*',
        ],
      },
      manifest: {
        name: 'Hobbies Collection',
        short_name: 'Hobbies',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
