-- Actualización completa de la base de datos para sistema de autenticación unificado
USE restaurant_music_db;

-- 1. CREAR TABLA DE USUARIOS REGISTRADOS (usuarios con cuenta completa)
CREATE TABLE registered_users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  bio TEXT,
  date_of_birth DATE,
  preferred_genres JSON, -- Array de géneros favoritos: ["rock", "pop", "jazz"]
  preferred_languages JSON, -- Array de idiomas: ["es", "en"]
  notification_preferences JSON, -- Configuraciones de notificaciones
  theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'dark',
  privacy_level ENUM('public', 'friends', 'private') DEFAULT 'public',
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  login_count INT DEFAULT 0,
  total_requests INT DEFAULT 0,
  favorite_restaurant_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (favorite_restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_active (is_active),
  INDEX idx_premium (is_premium),
  INDEX idx_created (created_at),
  INDEX idx_favorite_restaurant (favorite_restaurant_id)
);

-- 2. ACTUALIZAR TABLA RESTAURANTS (agregar campos faltantes y mejorar)
ALTER TABLE restaurants 
ADD COLUMN owner_name VARCHAR(100) AFTER name,
ADD COLUMN logo VARCHAR(500) AFTER owner_name,
ADD COLUMN cover_image VARCHAR(500) AFTER logo,
ADD COLUMN description TEXT AFTER cover_image,
ADD COLUMN website VARCHAR(255) AFTER description,
ADD COLUMN social_media JSON AFTER website, -- {"instagram": "@restaurant", "facebook": "page"}
ADD COLUMN business_hours JSON AFTER social_media, -- Horarios de operación
ADD COLUMN cuisine_type VARCHAR(100) AFTER business_hours,
ADD COLUMN price_range ENUM('$', '$$', '$$$', '$$$$') DEFAULT '$$' AFTER cuisine_type,
ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00 AFTER price_range,
ADD COLUMN total_reviews INT DEFAULT 0 AFTER rating,
ADD COLUMN verified BOOLEAN DEFAULT false AFTER total_reviews,
ADD COLUMN verification_date TIMESTAMP NULL AFTER verified,
ADD COLUMN last_login_at TIMESTAMP NULL AFTER verification_date,
ADD COLUMN settings JSON AFTER last_login_at; -- Configuraciones específicas del restaurante

-- Agregar índices adicionales para restaurants
ALTER TABLE restaurants
ADD INDEX idx_cuisine (cuisine_type),
ADD INDEX idx_rating (rating),
ADD INDEX idx_verified (verified),
ADD INDEX idx_city_country (city, country);

-- 3. ACTUALIZAR TABLA USERS (usuarios temporales/mesas)
-- Mantener la tabla actual pero agregar campos para conectar con usuarios registrados
ALTER TABLE users 
ADD COLUMN registered_user_id VARCHAR(36) NULL AFTER id,
ADD COLUMN user_type ENUM('guest', 'registered') DEFAULT 'guest' AFTER registered_user_id,
ADD COLUMN device_info JSON AFTER user_agent, -- Info del dispositivo
ADD COLUMN preferences JSON AFTER device_info, -- Preferencias temporales
ADD INDEX idx_registered_user (registered_user_id),
ADD INDEX idx_user_type (user_type),
ADD CONSTRAINT fk_users_registered_user 
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE SET NULL;

-- 4. ACTUALIZAR TABLA FAVORITES para soportar ambos tipos de usuarios
ALTER TABLE favorites 
ADD COLUMN registered_user_id VARCHAR(36) NULL AFTER user_id,
ADD COLUMN favorite_type ENUM('session', 'permanent') DEFAULT 'session',
ADD COLUMN notes TEXT AFTER favorite_type, -- Notas personales sobre la canción
ADD COLUMN play_count INT DEFAULT 0 AFTER notes,
ADD COLUMN last_played_at TIMESTAMP NULL AFTER play_count,
ADD INDEX idx_registered_user (registered_user_id),
ADD INDEX idx_favorite_type (favorite_type),
ADD CONSTRAINT fk_favorites_registered_user 
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE CASCADE;

-- Modificar la constraint única para permitir favoritos tanto de usuarios temporales como registrados
ALTER TABLE favorites DROP INDEX unique_user_song;
ALTER TABLE favorites 
ADD CONSTRAINT unique_temp_user_song UNIQUE (user_id, song_id),
ADD CONSTRAINT unique_reg_user_song UNIQUE (registered_user_id, song_id);

-- 5. CREAR TABLA DE LISTAS DE REPRODUCCIÓN (para usuarios registrados)
CREATE TABLE playlists (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  registered_user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cover_image VARCHAR(500),
  is_public BOOLEAN DEFAULT false,
  is_collaborative BOOLEAN DEFAULT false,
  play_count INT DEFAULT 0,
  song_count INT DEFAULT 0,
  total_duration INT DEFAULT 0, -- En segundos
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE CASCADE,
  INDEX idx_user_public (registered_user_id, is_public),
  INDEX idx_public (is_public),
  INDEX idx_created (created_at)
);

-- 6. CREAR TABLA DE CANCIONES EN LISTAS DE REPRODUCCIÓN
CREATE TABLE playlist_songs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  playlist_id VARCHAR(36) NOT NULL,
  song_id VARCHAR(36) NOT NULL,
  position INT NOT NULL,
  added_by VARCHAR(36) NOT NULL, -- registered_user_id que agregó la canción
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (added_by) REFERENCES registered_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_playlist_song (playlist_id, song_id),
  INDEX idx_playlist_position (playlist_id, position),
  INDEX idx_song (song_id),
  INDEX idx_added_by (added_by)
);

-- 7. CREAR TABLA DE HISTORIAL DE REPRODUCCIÓN (para usuarios registrados)
CREATE TABLE listening_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  registered_user_id VARCHAR(36) NOT NULL,
  song_id VARCHAR(36) NOT NULL,
  restaurant_id VARCHAR(36) NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  play_duration INT, -- Segundos que realmente escuchó
  was_completed BOOLEAN DEFAULT false,
  device_info JSON,
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_user_date (registered_user_id, played_at),
  INDEX idx_song_date (song_id, played_at),
  INDEX idx_restaurant_date (restaurant_id, played_at)
);

-- 8. CREAR TABLA DE REVIEWS DE RESTAURANTES (para usuarios registrados)
CREATE TABLE restaurant_reviews (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  restaurant_id VARCHAR(36) NOT NULL,
  registered_user_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  music_quality_rating INT CHECK (music_quality_rating >= 1 AND music_quality_rating <= 5),
  service_rating INT CHECK (service_rating >= 1 AND service_rating <= 5),
  ambiance_rating INT CHECK (ambiance_rating >= 1 AND ambiance_rating <= 5),
  is_anonymous BOOLEAN DEFAULT false,
  helpful_votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_restaurant_review (registered_user_id, restaurant_id),
  INDEX idx_restaurant_rating (restaurant_id, rating),
  INDEX idx_user (registered_user_id),
  INDEX idx_created (created_at)
);

-- 9. CREAR TABLA DE TOKENS DE AUTENTICACIÓN
CREATE TABLE auth_tokens (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  user_type ENUM('registered_user', 'restaurant') NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  token_type ENUM('access', 'refresh', 'email_verification', 'password_reset') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token_hash (token_hash),
  INDEX idx_user_type (user_id, user_type),
  INDEX idx_expires (expires_at),
  INDEX idx_token_type (token_type)
);

-- 10. INSERTAR DATOS DE PRUEBA PARA USUARIOS REGISTRADOS
INSERT INTO registered_users (id, name, email, password, phone, preferred_genres, is_active) VALUES
('reg-user-001', 'María González', 'maria@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/AmrwwXv4b.6WLfLz.', '+57 300 123 4567', '["pop", "rock", "ballad"]', true),
('reg-user-002', 'Carlos Rodríguez', 'carlos@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/AmrwwXv4b.6WLfLz.', '+57 300 765 4321', '["electronic", "hip-hop", "reggaeton"]', true),
('reg-user-003', 'Ana Martínez', 'ana@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/AmrwwXv4b.6WLfLz.', '+57 300 555 0123', '["jazz", "classical", "ballad"]', true);

-- 11. ACTUALIZAR DATOS DE RESTAURANTE DE PRUEBA
UPDATE restaurants SET 
  owner_name = 'Roberto Pérez',
  description = 'Un acogedor restaurante con la mejor música en vivo y ambiente familiar. Especializado en cocina colombiana contemporánea.',
  cuisine_type = 'Colombiana Contemporánea',
  price_range = '$$',
  rating = 4.5,
  total_reviews = 127,
  business_hours = '{"monday": "12:00-22:00", "tuesday": "12:00-22:00", "wednesday": "12:00-22:00", "thursday": "12:00-23:00", "friday": "12:00-24:00", "saturday": "12:00-24:00", "sunday": "12:00-21:00"}',
  social_media = '{"instagram": "@laterrazamusical", "facebook": "La Terraza Musical Bogotá"}',
  verified = true,
  verification_date = NOW()
WHERE id = 'rest-001';

-- 12. CREAR FAVORITOS PARA USUARIOS REGISTRADOS
INSERT INTO favorites (id, registered_user_id, song_id, restaurant_id, favorite_type, notes) VALUES
('fav-reg-001', 'reg-user-001', 'song-001', 'rest-001', 'permanent', 'Mi canción favorita de todos los tiempos'),
('fav-reg-002', 'reg-user-001', 'song-013', 'rest-001', 'permanent', 'Perfecta para relajarse'),
('fav-reg-003', 'reg-user-002', 'song-014', 'rest-001', 'permanent', 'Gran energía para bailar'),
('fav-reg-004', 'reg-user-003', 'song-005', 'rest-001', 'permanent', 'Excelente pieza de jazz');

-- 13. CREAR ALGUNAS LISTAS DE REPRODUCCIÓN
INSERT INTO playlists (id, registered_user_id, name, description, is_public) VALUES
('playlist-001', 'reg-user-001', 'Mis Clásicos', 'Las mejores canciones clásicas que nunca pasan de moda', true),
('playlist-002', 'reg-user-002', 'Para Bailar', 'Música perfecta para mover el cuerpo', true),
('playlist-003', 'reg-user-003', 'Música Relajante', 'Para momentos de tranquilidad y reflexión', false);

-- 14. AGREGAR CANCIONES A LAS LISTAS
INSERT INTO playlist_songs (id, playlist_id, song_id, position, added_by) VALUES
('ps-001', 'playlist-001', 'song-001', 1, 'reg-user-001'),
('ps-002', 'playlist-001', 'song-013', 2, 'reg-user-001'),
('ps-003', 'playlist-001', 'song-025', 3, 'reg-user-001'),
('ps-004', 'playlist-002', 'song-014', 1, 'reg-user-002'),
('ps-005', 'playlist-002', 'song-006', 2, 'reg-user-002'),
('ps-006', 'playlist-003', 'song-005', 1, 'reg-user-003'),
('ps-007', 'playlist-003', 'song-018', 2, 'reg-user-003');

-- 15. CREAR ALGUNAS RESEÑAS
INSERT INTO restaurant_reviews (id, restaurant_id, registered_user_id, rating, title, comment, music_quality_rating, service_rating, ambiance_rating) VALUES
('review-001', 'rest-001', 'reg-user-001', 5, 'Excelente experiencia musical', 'La variedad de música es increíble y el sistema de peticiones funciona perfecto', 5, 4, 5),
('review-002', 'rest-001', 'reg-user-002', 4, 'Muy buen ambiente', 'Me encanta poder pedir mi música favorita mientras ceno', 4, 4, 4),
('review-003', 'rest-001', 'reg-user-003', 5, 'Innovador concepto', 'Nunca había visto algo así, muy original y divertido', 5, 5, 5);

-- 16. CREAR VISTAS ACTUALIZADAS
CREATE OR REPLACE VIEW user_favorites_view AS
SELECT 
  COALESCE(f.registered_user_id, f.user_id) as user_id,
  CASE 
    WHEN f.registered_user_id IS NOT NULL THEN 'registered'
    ELSE 'guest'
  END as user_type,
  COALESCE(ru.name, u.name) as user_name,
  s.id as song_id,
  s.title,
  s.artist,
  s.album,
  s.genre,
  s.image,
  f.notes,
  f.play_count,
  f.created_at as favorited_at,
  r.name as restaurant_name
FROM favorites f
LEFT JOIN registered_users ru ON f.registered_user_id = ru.id
LEFT JOIN users u ON f.user_id = u.id
JOIN songs s ON f.song_id = s.id
JOIN restaurants r ON f.restaurant_id = r.id
ORDER BY f.created_at DESC;

CREATE OR REPLACE VIEW user_stats_view AS
SELECT 
  'registered' as user_type,
  ru.id as user_id,
  ru.name,
  ru.email,
  COUNT(DISTINCT f.id) as total_favorites,
  COUNT(DISTINCT p.id) as total_playlists,
  COUNT(DISTINCT lh.id) as total_plays,
  COUNT(DISTINCT rr.id) as total_reviews,
  ru.created_at as joined_at
FROM registered_users ru
LEFT JOIN favorites f ON ru.id = f.registered_user_id
LEFT JOIN playlists p ON ru.id = p.registered_user_id
LEFT JOIN listening_history lh ON ru.id = lh.registered_user_id
LEFT JOIN restaurant_reviews rr ON ru.id = rr.registered_user_id
GROUP BY ru.id

UNION ALL

SELECT 
  'guest' as user_type,
  u.id as user_id,
  u.name,
  u.session_id as email,
  COUNT(DISTINCT f.id) as total_favorites,
  0 as total_playlists,
  0 as total_plays,
  0 as total_reviews,
  u.created_at as joined_at
FROM users u
LEFT JOIN favorites f ON u.id = f.user_id
GROUP BY u.id;

-- 17. PROCEDIMIENTOS ALMACENADOS ÚTILES
DELIMITER //

CREATE PROCEDURE GetUserProfile(IN user_id VARCHAR(36), IN user_type ENUM('registered', 'guest'))
BEGIN
  IF user_type = 'registered' THEN
    SELECT 
      ru.*,
      COUNT(DISTINCT f.id) as total_favorites,
      COUNT(DISTINCT p.id) as total_playlists,
      COUNT(DISTINCT lh.id) as total_listening_history
    FROM registered_users ru
    LEFT JOIN favorites f ON ru.id = f.registered_user_id
    LEFT JOIN playlists p ON ru.id = p.registered_user_id
    LEFT JOIN listening_history lh ON ru.id = lh.registered_user_id
    WHERE ru.id = user_id
    GROUP BY ru.id;
  ELSE
    SELECT 
      u.*,
      COUNT(DISTINCT f.id) as total_favorites,
      0 as total_playlists,
      0 as total_listening_history
    FROM users u
    LEFT JOIN favorites f ON u.id = f.user_id
    WHERE u.id = user_id
    GROUP BY u.id;
  END IF;
END//

DELIMITER ;

-- 18. VERIFICACIÓN FINAL
SELECT 'Tabla' as tipo, 'Registros' as cantidad
UNION ALL
SELECT 'Restaurantes', CAST(COUNT(*) AS CHAR) FROM restaurants
UNION ALL  
SELECT 'Usuarios Registrados', CAST(COUNT(*) AS CHAR) FROM registered_users
UNION ALL
SELECT 'Usuarios Temporales', CAST(COUNT(*) AS CHAR) FROM users
UNION ALL
SELECT 'Canciones', CAST(COUNT(*) AS CHAR) FROM songs
UNION ALL
SELECT 'Favoritos', CAST(COUNT(*) AS CHAR) FROM favorites
UNION ALL
SELECT 'Listas Reproducción', CAST(COUNT(*) AS CHAR) FROM playlists
UNION ALL
SELECT 'Reviews', CAST(COUNT(*) AS CHAR) FROM restaurant_reviews;