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
      includeAssets: ['favicon.ico'],
      manifest: {
        name: "Pyjama DZ - L'Atelier",
        short_name: "Pyjama DZ",
        description: "Application de gestion visuelle des produits et étiquettes code-barres pour l'Atelier",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=192&q=80",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=512&q=80",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
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
