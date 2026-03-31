import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PappaFit Logger',
        short_name: 'PappaFit',
        description: 'Daily Fitness Tracker',
        theme_color: '#fef9f0',
        background_color: '#fef9f0',
        display: 'standalone',
        scope: '/PappaFitLogger/',
        start_url: '/PappaFitLogger/',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
      },
    }),
  ],
  base: '/PappaFitLogger/',
})
