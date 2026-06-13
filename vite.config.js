import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // demo dogfoods the local library source instead of a published copy
      '@iankibetsh/shframework': path.resolve(__dirname, './src/index.js')
    }
  },
  server: {
    port:3000
  }
})
