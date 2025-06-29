import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  base: '/',
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'gsap': ['gsap'],
          'vue': ['vue'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['three', 'gsap'],
  },
})
