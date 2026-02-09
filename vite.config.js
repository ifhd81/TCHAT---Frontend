import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs'

const apiJsPath = resolve(__dirname, 'api.js')

export default defineConfig(({ mode }) => {
  // تحميل .env من مجلد frontend — رابط الباكند من VITE_API_URL فقط (لا روابط ثابتة)
  const env = loadEnv(mode, __dirname, '')
  const apiBaseUrl = env.VITE_API_URL || process.env.VITE_API_URL || 'http://localhost:3000/api/v1'

  return {
  server: {
    host: true,
    allowedHosts: true, // السماح بأي مضيف (تطوير)
    port: 5173,
    open: true
  },
  preview: {
    host: true,
    allowedHosts: true, // السماح بأي مضيف (tchat-frontend، wa.herksa.com، إلخ)
    port: process.env.PORT || 4173,
    strictPort: false
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
        automations: resolve(__dirname, 'automations.html'),
        'ai-chatbot': resolve(__dirname, 'ai-chatbot.html'),
      },
      output: {
        manualChunks: undefined
      }
    }
  },
  plugins: [
    // في وضع التطوير: اعتراض طلب api.js وإرجاع نسخة مع رابط السيرفر من .env (سكربت عادي لا يمرّ بـ transform)
    {
      name: 'inject-api-url-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const path = req.url?.split('?')[0] || ''
          if (path === '/api.js' || path.endsWith('/api.js')) {
            try {
              let content = readFileSync(apiJsPath, 'utf-8')
              content = content.replace("'__VITE_API_URL__'", JSON.stringify(apiBaseUrl))
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
              res.end(content)
              return
            } catch (e) {
              console.error('inject-api-url-dev:', e)
            }
          }
          if (path === '/config.js' || path.endsWith('/config.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
            res.end(`window.API_BASE_URL=${JSON.stringify(apiBaseUrl)};\n`)
            return
          }
          next()
        })
      }
    },
    // عند البناء: نسخ api.js مع الرابط الصحيح إلى dist
    {
      name: 'copy-api-js',
      closeBundle() {
        try {
          mkdirSync('dist', { recursive: true });
          let content = readFileSync(resolve(__dirname, 'api.js'), 'utf-8');
          content = content.replace("'__VITE_API_URL__'", JSON.stringify(apiBaseUrl));
          writeFileSync(resolve(__dirname, 'dist/api.js'), content);
          writeFileSync(resolve(__dirname, 'dist/config.js'), `window.API_BASE_URL=${JSON.stringify(apiBaseUrl)};\n`);
          console.log('✓ api.js + config.js written with API_BASE_URL from .env:', apiBaseUrl);
        } catch (err) {
          console.error('Error writing api.js:', err);
        }
      }
    },
    // نسخ components (مثل header.js) إلى dist حتى تعمل الصفحات بعد النشر
    {
      name: 'copy-components',
      closeBundle() {
        try {
          const componentsDir = resolve(__dirname, 'dist/components');
          mkdirSync(componentsDir, { recursive: true });
          copyFileSync(
            resolve(__dirname, 'components/header.js'),
            resolve(componentsDir, 'header.js')
          );
          console.log('✓ components/header.js copied to dist');
        } catch (err) {
          console.error('Error copying components:', err);
        }
      }
    }
  ]
  }
})
