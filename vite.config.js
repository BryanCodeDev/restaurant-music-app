import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Alias de rutas para imports más limpios
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@data': resolve(__dirname, 'src/data'),
    },
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true, // Para acceso desde red local
    open: true, // Abre automáticamente el navegador
  },
  
  // Configuración de build
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    
    // Optimizaciones de bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries en chunks
          react: ['react', 'react-dom'],
          lucide: ['lucide-react'],
          utils: ['./src/utils/helpers.js'],
        },
      },
    },
    
    // Compresión y minificación
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.log en producción
        drop_debugger: true,
      },
    },
  },
  
  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
  
  // CSS configuración
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },
  
  // Preview server configuración
  preview: {
    port: 4173,
    host: true,
  },
})