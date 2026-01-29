import { defineConfig } from 'vite'
import { resolve } from 'path'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'

// قراءة رابط API من .env أو متغيرات البيئة (Railway يضبط VITE_API_URL)
const apiBaseUrl = process.env.VITE_API_URL || 'http://localhost:3000/api/v1'

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
          let content = readFileSync(resolve(__dirname, 'api.js'), 'utf-8');
          content = content.replace("'__VITE_API_URL__'", JSON.stringify(apiBaseUrl));
          writeFileSync(resolve(__dirname, 'dist/api.js'), content);
          console.log('✓ api.js written with API_BASE_URL:', apiBaseUrl);
        } catch (err) {
          console.error('Error writing api.js:', err);
        }
      }
    }
  ]
})
