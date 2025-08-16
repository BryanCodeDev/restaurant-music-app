# 🎵 Restaurant Music App - MusicMenu

Una aplicación interactiva para peticiones musicales en restaurantes que permite a los clientes pedir sus canciones favoritas y crear el ambiente perfecto mientras disfrutan su comida.

## ✨ Características Principales

- 🎸 **Catálogo extenso de música** con filtros por género
- 🔍 **Búsqueda inteligente** por título, artista o género
- ❤️ **Sistema de favoritos** personalizado
- ⏰ **Cola de peticiones en tiempo real** con estimación de tiempos
- 📱 **Diseño completamente responsive** para móviles y tablets
- 🎨 **Interfaz moderna** con efectos glassmorphism y gradientes
- 🚀 **Performance optimizada** con lazy loading
- 🔌 **Integración opcional con Spotify** para acceso a millones de canciones

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Styling y diseño responsive
- **Lucide React** - Iconografía moderna
- **Axios** - Cliente HTTP para APIs
- **PostCSS** - Procesamiento de CSS

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js (≥16.0.0)
- npm (≥8.0.0)

### 1. Clonar y configurar el proyecto

```bash
# Crear el proyecto
npm create vite@latest restaurant-music-app -- --template react
cd restaurant-music-app

# Instalar dependencias principales
npm install
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react axios

# Configurar Tailwind CSS
npx tailwindcss init -p
```

### 2. Configurar estructura de archivos

Crea la estructura de carpetas:
```
src/
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── music/           # SongCard, SearchBar, etc.
│   ├── pages/           # HomePage, BrowseMusic, etc.
│   └── common/          # Button, Modal
├── data/                # mockData.js
├── hooks/               # useMusicData.js
├── utils/               # helpers.js
├── App.jsx
├── main.jsx
└── index.css
```

### 3. Copiar los archivos del proyecto

Copia todos los archivos de código proporcionados en sus respectivas ubicaciones.

### 4. Iniciar el proyecto

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

### Integración con Spotify (Opcional)

1. **Crear app en Spotify Developers:**
   - Ve a https://developer.spotify.com/dashboard
   - Crea una nueva aplicación
   - Obtén tu `CLIENT_ID` y `CLIENT_SECRET`

2. **Configurar variables:**
   ```env
   VITE_SPOTIFY_CLIENT_ID=tu_client_id
   VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret
   ```

3. **Habilitar API real:**
   ```javascript
   // En useMusicData.js
   const [useRealAPI, setUseRealAPI] = useState(true);
   ```

## 📱 Uso de la Aplicación

### Para Clientes del Restaurante:

1. **Explorar Música**: Navega por géneros o busca canciones específicas
2. **Agregar Favoritos**: Marca tus canciones favoritas con ❤️
3. **Pedir Canciones**: Envía peticiones que van a la cola del restaurante
4. **Ver Estado**: Monitorea el progreso de tus peticiones

### Para Administradores:

- Panel de control para gestionar la cola
- Estadísticas de uso y preferencias
- Configuración de géneros permitidos
- Moderación de contenido

## 🎨 Personalización

### Colores y Temas

Modifica `tailwind.config.js` para cambiar la paleta de colores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Tus colores personalizados
      }
    }
  }
}
```

### Géneros Musicales

Edita `src/data/mockData.js` para agregar o modificar géneros:

```javascript
export const genres = [
  { id: 'rock', name: 'Rock', emoji: '🎸' },
  { id: 'pop', name: 'Pop', emoji: '✨' },
  // Agregar más géneros...
];
```

## 📊 Modelo de Negocio Sugerido

### Precios para Colombia:

**Sin Spotify:**
- Básico: $89.900/mes (1-10 mesas)
- Profesional: $179.900/mes (10-25 mesas)
- Premium: $299.900/mes (25+ mesas)

**Con Spotify:**
- Básico: $149.900/mes
- Pro: $249.900/mes
- Premium: $399.900/mes

## 🚀 Despliegue en Producción

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Subir carpeta 'dist' a Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
npm run format       # Formatear código con Prettier
```

## 🧪 Testing

```bash
# Instalar dependencias de testing
npm install -D @testing-library/react @testing-library/jest-dom vitest

# Ejecutar tests
npm run test
```

## 📈 Roadmap

### Próximas Funcionalidades:

- [ ] **Backend con WebSockets** para sincronización real
- [ ] **Sistema de autenticación** por mesa/QR
- [ ] **Panel administrativo** para staff del restaurante
- [ ] **Analytics avanzados** de preferencias musicales
- [ ] **Chat entre usuarios** de la misma mesa
- [ ] **Playlists colaborativas**
- [ ] **Sistema de votación** para canciones
- [ ] **Integración con sistemas POS**
- [ ] **Notificaciones push**
- [ ] **Modo offline** con cache

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🆘 Soporte

- **Email**: soporte@musicmenu.co
- **Discord**: [Servidor de la comunidad](#)
- **Documentación**: [docs.musicmenu.co](#)

## 👥 Equipo

- **Desarrollador Principal**: Tu Nombre
- **Diseño UI/UX**: [Nombre]
- **Backend**: [Nombre]
- **QA**: [Nombre]

---

**¿Te gusta el proyecto? ¡Dale una ⭐ en GitHub!**