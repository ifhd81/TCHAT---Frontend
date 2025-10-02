import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    strictPort: false,
    allowedHosts: [
      'tchat-frontend-production.up.railway.app',
      '.railway.app'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        chats: resolve(__dirname, 'chats.html'),
        customers: resolve(__dirname, 'customers.html'),
        campaigns: resolve(__dirname, 'campaigns.html'),
        templates: resolve(__dirname, 'templates.html'),
        webhooks: resolve(__dirname, 'webhooks.html'),
      },
      output: {
        manualChunks: undefined
      }
    }
  },
  plugins: [
    {
      name: 'copy-api-js',
      closeBundle() {
        try {
          mkdirSync('dist', { recursive: true });
          copyFileSync('api.js', 'dist/api.js');
          console.log('✓ Copied api.js to dist/');
        } catch (err) {
          console.error('Error copying api.js:', err);
        }
      }
    }
  ]
})
