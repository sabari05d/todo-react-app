import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import icon192 from './src/assets/logo/icon-192x192.png'
import icon512 from './src/assets/logo/icon-512x512.png'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DoQuest',
        short_name: 'DoQuest',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4a90e2',
        icons: [
          { src: icon192, sizes: '192x192', type: 'image/png' },
          { src: icon512, sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
}
