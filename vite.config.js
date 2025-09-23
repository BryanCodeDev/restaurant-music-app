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
    sourcemap: true,
    
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
            return 'utils';
          }
        },
      },
    },
    
    // Usar esbuild por defecto (más rápido) o terser si está instalado
    minify: 'esbuild', // Cambiar a 'terser' si instalas terser
    
    // Solo incluir terserOptions si usas terser
    // terserOptions: {
    //   compress: {
    //     drop_console: true, // Remover console.log en producción
    //     drop_debugger: true,
    //   },
    // },
    
    // Configuraciones adicionales para optimización
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false, // Mejora velocidad de build
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