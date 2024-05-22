import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: 'https://server-mern-ecommerce2.vercel.app/',
        changeOrigin: true,
        secure: false,
      },
    },
    host:true,
    port:5173
  },
})