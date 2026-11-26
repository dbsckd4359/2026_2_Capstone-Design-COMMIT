import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], 
 
  server:{
    proxy:{
      '/api':{
     // target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),//백엔드 경로가 /api로 시작하면 여기 삭제
      }
    }
  }
    
})
