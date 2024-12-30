import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')

  // dev requires string, prod - not
  const defineTransform = (value) => {
    if (mode === 'development') {
      return JSON.stringify(value)
    }
    return value
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          ws: true
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/script.js',
          assetFileNames: 'assets/styles.css'
        }
      }
    },
    define: {
      __APP_VERSION__: defineTransform(env.npm_package_version),
      __APP_MODE__: defineTransform(env.VITE_MODE),
      __BUILD_DATE__: defineTransform(new Date().toISOString())
    },
    base: env.BASE_PATH ?? ''
  }
})
