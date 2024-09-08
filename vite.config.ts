import { fileURLToPath, URL } from 'node:url'

import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { vitePluginForArco } from '@arco-plugins/vite-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'APP')

  return {
    base: env.APP_BASE_URL || '/',
    envPrefix: 'APP',
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dts: 'unplugin/auto-imports.d.ts',
        dirs: ['src/api', 'src/hooks', 'src/utils', 'src/stores', 'src/constant'],
        resolvers: []
      }),
      Components({
        dts: 'unplugin/components.d.ts',
        dirs: ['src/components', 'src/views/**/**/components', 'src/layouts/**/components'],
        resolvers: []
      }),
      vitePluginForArco({
        style: 'css'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~/': `${path.resolve(__dirname, 'src')}/`
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/global.scss" as *;`
        }
      }
    },

    build: {
      minify: 'esbuild',
      // minify: 'terser',
      // // 打包后的文件
      outDir: env.APP_OUT_DIR || 'dist',
      assetsDir: 'static',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name]-[hash].js',
          chunkFileNames: 'static/js/[name]-[hash].js',
          assetFileNames(assetInfo) {
            const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico']
            if (assetInfo.name?.endsWith('.css')) {
              return 'static/css/[name]-[hash].css'
            }
            if (imgExts.some((ext) => assetInfo.name?.endsWith(ext))) {
              return 'static/images/[name]-[hash][ext]'
            }
            return 'assets/[name]-[hash][ext]'
          },

          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },

    server: {
      host: '0.0.0.0',
      port: 4000
    },
    esbuild: {
      // drop: ['console', 'debugger']
    },
    // cssCodeSplit: false,
    define: {
      // enable hydration mismatch details in production build
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    }
  }
})
