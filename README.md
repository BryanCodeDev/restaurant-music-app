# Restaurant Music App

Una aplicación web para que los clientes de restaurantes puedan solicitar música y los administradores gestionen la cola de reproducción.

## Características Principales

### Para Clientes
- **Selección de Restaurante**: Elige entre múltiples restaurantes disponibles.
- **Solicitud de Canciones**: Explora el catálogo musical y solicita canciones.
- **Cola de Reproducción**: Ve el estado de tus peticiones y la cola general.
- **Favoritos**: Guarda tus canciones favoritas (soporte para usuarios invitados y registrados).
- **Nuevas Features**:
  - **Usuarios Registrados**: Crea una cuenta para guardar favoritos permanentes, historial y playlists.
  - **Playlists**: Crea y gestiona listas de reproducción personalizadas.
  - **Historial de Reproducción**: Revisa las canciones que has escuchado recientemente.
  - **Reseñas de Restaurantes**: Califica y comenta sobre la experiencia musical en restaurantes.

### Para Administradores de Restaurantes
- **Panel de Administración**: Gestión completa de la cola musical en tiempo real.
- **Estadísticas**: Visualiza métricas de uso y peticiones.
- **Control de Reproducción**: Play, pause, siguiente, anterior y volumen.
- **Gestión de Límites**: Configura límites por usuario y cola.

## Requisitos de Base de Datos

La aplicación usa MySQL con el esquema definido en `script2.sql`. Cambios clave respecto a versiones anteriores:

### Tablas Nuevas/Actualizadas
- **registered_users**: Usuarios permanentes con campos como `preferred_genres`, `notification_preferences`, `is_premium`.
- **users**: Ahora soporta `registered_user_id` para vincular sesiones de invitados a usuarios registrados.
- **favorites**: Soporta `user_id` (invitados) y `registered_user_id` (registrados), con `favorite_type`.
- **playlists** y **playlist_songs**: Gestión de listas de reproducción.
- **listening_history**: Historial de reproducción por usuario registrado.
- **restaurant_reviews**: Reseñas con ratings específicos para música, servicio y ambiente.
- **auth_tokens**: Manejo de tokens de acceso y refresh para autenticación segura.
- **restaurants**: Campos adicionales como `logo`, `cover_image`, `description`, `rating`, `total_reviews`, `cuisine_type`, `price_range`.

### Vistas y Procedimientos
- **user_favorites_view**: Une favoritos de invitados y registrados.
- **user_stats_view**: Estadísticas por tipo de usuario.
- **GetUserProfile**: Procedimiento para obtener perfil completo por tipo de usuario.

Ejecuta `script2.sql` para configurar la base de datos. Asegúrate de que el backend esté actualizado para usar estos esquemas.

## Instalación

### Requisitos
- Node.js 18+
- MySQL 8.0+
- Backend actualizado (Node.js/Express)

### Frontend
1. Clona el repositorio
2. `cd restaurant-music-app`
3. `npm install`
4. Configura `.env` con `VITE_API_URL=http://localhost:5000/api/v1`
5. `npm run dev`

### Backend
- Usa el backend actualizado compatible con `script2.sql`.
- Configura conexión a MySQL y ejecuta el script SQL.

## Estructura del Proyecto

```
src/
├── components/
│   ├── auth/          # Login y Register para usuarios y restaurantes
│   ├── admin/         # Dashboard y QueueManager
│   ├── music/         # MusicPlayer, SongCard, etc.
│   └── pages/         # HomePage, Favorites, Playlists, ListeningHistory, RestaurantReviews
├── hooks/             # useMusic, useRestaurantMusic (actualizados para user_type)
├── services/          # apiService (con métodos para nuevas features)
└── App.jsx            # Rutas integradas para nuevas páginas
```

## Nuevas Features Implementadas

- **Autenticación Avanzada**: Soporte para usuarios registrados con refresh tokens y verificación de email.
- **Playlists**: Crea, edita y comparte listas desde la página de playlists.
- **Historial**: Ve canciones reproducidas en ListeningHistory.
- **Reseñas**: Califica restaurantes en RestaurantReviews con ratings detallados.
- **Restaurantes Mejorados**: Muestra logo, descripción y rating en HomePage y RestaurantSelector.

## Uso

1. **Como Cliente**: Selecciona restaurante → Explora música → Solicita canciones → Gestiona favoritos/playlists.
2. **Como Usuario Registrado**: Regístrate/login → Accede a historial, playlists y reseñas.
3. **Como Admin**: Login en panel → Gestiona cola y estadísticas.

## Contribuyendo

1. Fork el repositorio
2. Crea branch `feature/nombre-feature`
3. Commit cambios
4. Push y PR

## Licencia

MIT