import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Alias de rutas para imports más limpios
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
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
    sourcemap: false,
    
    // Optimizaciones de bundle
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar vendor libraries automáticamente
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Otras librerías en un chunk separado
            return 'vendor';
          }
          
          // Separar utils si es lo suficientemente grande
          if (id.includes('src/utils')) {
            // Solo crear chunk si tiene contenido sustancial
            return null;
          }
        },
        // Optimize chunk naming for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
      },
    },
    
    // Usar terser para mejor minificación en producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      format: {
        comments: false,
      },
    },
    
    // Configuraciones adicionales para optimización
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true,
    },
  },
  
  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
  
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    // Excluir archivos que no necesitan pre-bundling
    exclude: [],
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