import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['manifest.json', 'favicon.ico', 'favicon.svg', 'logo.svg', 'favicon.png', 'logo.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-64x64.png', 'pwa-maskable-512x512.png'],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
      manifest: {
        name: "Pyjama DZ - L'Atelier",
        short_name: "Pyjama DZ",
        description: "Application de gestion visuelle des produits et étiquettes code-barres pour l'Atelier",
        theme_color: "#be123c",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "/logo.svg",
            sizes: "192x192 512x512 any",
            type: "image/svg+xml"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
