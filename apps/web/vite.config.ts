import { defineConfig } from 'vite';
import ReactVite from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 18080,
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
        name: 'Films Collection',
        short_name: 'Films',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
