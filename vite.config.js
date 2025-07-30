import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Critical vendor libraries - load first
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-critical';
          }
          // Essential UI libraries
          if (id.includes('@mui/material') || id.includes('@emotion')) {
            return 'ui-core';
          }
          // Secondary UI components
          if (id.includes('@mui/icons-material')) {
            return 'ui-icons';
          }
          // Route and navigation
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          // Animation libraries (non-critical)
          if (id.includes('framer-motion') || id.includes('gsap')) {
            return 'animations';
          }
          // Utilities
          if (id.includes('axios')) {
            return 'utils';
          }
          // Separate large dependencies
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096,
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    reportCompressedSize: false,
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
  },
})
