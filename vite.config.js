import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// base 需匹配 GitHub Pages 项目页面路径：/<仓库名>/
export default defineConfig({
  plugins: [vue()],
  base: '/fundamental-data/',
  server: {
    port: 5173,
    open: true
  }
})
