-- ============================
-- CREACIÓN DE BASE DE DATOS
-- ============================
DROP DATABASE IF EXISTS restaurant_music_db;
CREATE DATABASE restaurant_music_db;
USE restaurant_music_db;

-- ============================
-- CONFIGURACIÓN INICIAL
-- ============================
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
-- SET time_zone = 'America/New_York'; -- Comentado: usar zona horaria del sistema

-- ============================
-- TABLAS PRINCIPALES
-- ============================

-- Restaurantes
CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  logo VARCHAR(500),
  cover_image VARCHAR(500),
  description TEXT,
  website VARCHAR(255),
  social_media JSON,
  business_hours JSON,
  cuisine_type VARCHAR(100),
  price_range ENUM('$', '$$', '$$$', '$$$$') DEFAULT '$$',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255) NULL,
  verification_date TIMESTAMP NULL,
  pending_approval BOOLEAN DEFAULT true,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  max_requests_per_user INT DEFAULT 2,
  queue_limit INT DEFAULT 50,
  auto_play BOOLEAN DEFAULT true,
  allow_explicit BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  subscription_plan ENUM('free', 'premium', 'enterprise') DEFAULT 'free',
  last_login_at TIMESTAMP NULL,
  settings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_email (email),
  INDEX idx_active (is_active),
  INDEX idx_cuisine (cuisine_type),
  INDEX idx_rating (rating),
  INDEX idx_verified (verified),
  INDEX idx_city_country (city, country)
);

-- Usuarios registrados (cuentas permanentes)
CREATE TABLE registered_users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(500),
  bio TEXT,
  date_of_birth DATE,
  preferred_genres JSON,
  preferred_languages JSON,
  notification_preferences JSON,
  theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'dark',
  privacy_level ENUM('public', 'friends', 'private') DEFAULT 'public',
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255) NULL,
  email_verified_at TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  login_count INT DEFAULT 0,
  total_requests INT DEFAULT 0,
  role ENUM('user', 'superadmin') DEFAULT 'user',
  favorite_restaurant_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (favorite_restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_active (is_active),
  INDEX idx_premium (is_premium),
  INDEX idx_role (role),
  INDEX idx_created (created_at),
  INDEX idx_favorite_restaurant (favorite_restaurant_id)
);

-- Usuarios temporales (mesas)
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  registered_user_id VARCHAR(36) NULL,
  user_type ENUM('guest', 'registered') DEFAULT 'guest',
  restaurant_id VARCHAR(36) NOT NULL,
  table_number VARCHAR(50) NOT NULL,
  session_id VARCHAR(255),
  name VARCHAR(100),
  total_requests INT DEFAULT 0,
  requests_today INT DEFAULT 0,
  last_request_at TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info JSON,
  preferences JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE SET NULL,
  INDEX idx_restaurant_table (restaurant_id, table_number),
  INDEX idx_session (session_id),
  INDEX idx_ip (ip_address),
  INDEX idx_created (created_at),
  INDEX idx_registered_user (registered_user_id),
  INDEX idx_user_type (user_type)
);

-- Canciones
CREATE TABLE songs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  restaurant_id VARCHAR(36) NOT NULL,
  title VARCHAR(300) NOT NULL,
  artist VARCHAR(300) NOT NULL,
  album VARCHAR(300),
  duration VARCHAR(10) NOT NULL,
  year INT,
  spotify_id VARCHAR(50),
  preview_url VARCHAR(500),
  image VARCHAR(500),
  genre VARCHAR(50) NOT NULL,
  popularity INT DEFAULT 0,
  energy INT DEFAULT 0,
  is_explicit BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  times_requested INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_restaurant_active (restaurant_id, is_active),
  INDEX idx_genre (genre),
  INDEX idx_popularity (popularity),
  INDEX idx_times_requested (times_requested),
  FULLTEXT(title, artist, album)
);

-- Peticiones
CREATE TABLE requests (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  restaurant_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  song_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'playing', 'completed', 'cancelled') DEFAULT 'pending',
  queue_position INT DEFAULT 0,
  user_table VARCHAR(50) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_playing_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  INDEX idx_restaurant_status (restaurant_id, status),
  INDEX idx_queue_position (queue_position),
  INDEX idx_user_status (user_id, status),
  INDEX idx_requested_at (requested_at),
  INDEX idx_restaurant_date (restaurant_id, requested_at)
);

-- Favoritos
CREATE TABLE favorites (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NULL,
  registered_user_id VARCHAR(36) NULL,
  song_id VARCHAR(36) NOT NULL,
  restaurant_id VARCHAR(36) NOT NULL,
  favorite_type ENUM('session', 'permanent') DEFAULT 'session',
  notes TEXT,
  play_count INT DEFAULT 0,
  last_played_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  CONSTRAINT unique_temp_user_song UNIQUE (user_id, song_id),
  CONSTRAINT unique_reg_user_song UNIQUE (registered_user_id, song_id),
  INDEX idx_user_restaurant (user_id, restaurant_id),
  INDEX idx_song (song_id),
  INDEX idx_registered_user (registered_user_id),
  INDEX idx_favorite_type (favorite_type)
);

-- Configuración extra de restaurantes
CREATE TABLE restaurant_settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  restaurant_id VARCHAR(36) NOT NULL,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_restaurant_setting (restaurant_id, setting_key)
);

-- Logs de actividad
CREATE TABLE activity_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id VARCHAR(36),
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(36),
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_restaurant_date (restaurant_id, created_at),
  INDEX idx_action (action),
  INDEX idx_entity (entity_type, entity_id)
);

-- ============================
-- NUEVAS TABLAS (DEL SCRIPT2)
-- ============================

-- Playlists
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
  total_duration INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE CASCADE,
  INDEX idx_user_public (registered_user_id, is_public),
  INDEX idx_public (is_public),
  INDEX idx_created (created_at)
);

-- Canciones en playlists
CREATE TABLE playlist_songs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  playlist_id VARCHAR(36) NOT NULL,
  song_id VARCHAR(36) NOT NULL,
  position INT NOT NULL,
  added_by VARCHAR(36) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (added_by) REFERENCES registered_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_playlist_song (playlist_id, song_id),
  INDEX idx_playlist_position (playlist_id, position),
  INDEX idx_song (song_id),
  INDEX idx_added_by (added_by)
);

-- Historial de reproducción
CREATE TABLE listening_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  registered_user_id VARCHAR(36) NOT NULL,
  song_id VARCHAR(36) NOT NULL,
  restaurant_id VARCHAR(36) NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  play_duration INT,
  was_completed BOOLEAN DEFAULT false,
  device_info JSON,
  FOREIGN KEY (registered_user_id) REFERENCES registered_users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_user_date (registered_user_id, played_at),
  INDEX idx_song_date (song_id, played_at),
  INDEX idx_restaurant_date (restaurant_id, played_at)
);

-- Reviews de restaurantes
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

-- Tokens de autenticación
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

-- ============================
-- TABLA DE PLANES DE SUSCRIPCIÓN
-- ============================

CREATE TABLE subscription_plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  period VARCHAR(20) NOT NULL,
  description TEXT,
  features JSON,
  limitations JSON,
  color VARCHAR(50),
  popular BOOLEAN DEFAULT false,
  max_requests INT,
  max_tables INT,
  has_spotify BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar planes de suscripción
INSERT INTO subscription_plans (id, name, price, period, description, features, limitations, color, popular, max_requests, max_tables, has_spotify) VALUES
('starter', 'Starter', 80000.00, 'mes', 'Perfecto para comenzar', JSON_ARRAY('Hasta 50 mesas', 'Cola musical básica', '1,000 peticiones/mes', 'Soporte por email', 'Estadísticas básicas'), JSON_ARRAY('Sin personalización avanzada', 'Sin API access'), 'blue', false, 1000, 50, false),
('professional', 'Professional', 120000.00, 'mes', 'Ideal para restaurantes establecidos', JSON_ARRAY('Mesas ilimitadas', 'Cola musical avanzada', '10,000 peticiones/mes', 'Soporte prioritario 24/7', 'Analytics completos', 'Personalización completa', 'Integración con Spotify', 'Control de contenido'), JSON_ARRAY(), 'amber', true, 10000, null, true),
('enterprise', 'Enterprise', 300000.00, 'mes', 'Para cadenas y grandes establecimientos', JSON_ARRAY('Todo lo de Professional', 'Múltiples ubicaciones', 'Peticiones ilimitadas', 'Soporte dedicado', 'API completa', 'White-label', 'Integración personalizada', 'SLA garantizado'), JSON_ARRAY(), 'purple', false, null, null, true);

-- ============================
-- ACTUALIZAR TABLA RESTAURANTS
-- ============================

-- Agregar campos de suscripción
ALTER TABLE restaurants
ADD COLUMN subscription_plan_id VARCHAR(50) NULL,
ADD COLUMN subscription_status ENUM('active', 'inactive', 'pending', 'cancelled') DEFAULT 'pending',
ADD COLUMN subscription_start_date TIMESTAMP NULL,
ADD COLUMN subscription_end_date TIMESTAMP NULL,
ADD COLUMN subscription_payment_proof VARCHAR(500) NULL,
ADD FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id) ON DELETE SET NULL,
ADD INDEX idx_subscription_plan (subscription_plan_id),
ADD INDEX idx_subscription_status (subscription_status);

-- Recrear tabla restaurants desde cero con el nuevo esquema
-- Primero eliminar foreign keys que apuntan a restaurants
SET FOREIGN_KEY_CHECKS = 0;

-- Hacer backup de los datos
CREATE TABLE restaurants_backup AS SELECT * FROM restaurants;

-- Eliminar tabla original
DROP TABLE restaurants;

-- Recrear tabla restaurants con el nuevo esquema
CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  logo VARCHAR(500),
  cover_image VARCHAR(500),
  description TEXT,
  website VARCHAR(255),
  social_media JSON,
  business_hours JSON,
  cuisine_type VARCHAR(100),
  price_range ENUM('$', '$$', '$$$', '$$$$') DEFAULT '$$',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255) NULL,
  verification_date TIMESTAMP NULL,
  pending_approval BOOLEAN DEFAULT true,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  max_requests_per_user INT DEFAULT 2,
  queue_limit INT DEFAULT 50,
  auto_play BOOLEAN DEFAULT true,
  allow_explicit BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  subscription_plan_id VARCHAR(50) NULL,
  subscription_status ENUM('active', 'inactive', 'pending', 'cancelled') DEFAULT 'pending',
  subscription_start_date TIMESTAMP NULL,
  subscription_end_date TIMESTAMP NULL,
  subscription_payment_proof VARCHAR(500) NULL,
  last_login_at TIMESTAMP NULL,
  settings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_email (email),
  INDEX idx_active (is_active),
  INDEX idx_cuisine (cuisine_type),
  INDEX idx_rating (rating),
  INDEX idx_verified (verified),
  INDEX idx_city_country (city, country),
  INDEX idx_subscription_plan (subscription_plan_id),
  INDEX idx_subscription_status (subscription_status)
);

-- Insertar datos desde la tabla backup con la migración corregida
INSERT INTO restaurants (
  id, name, owner_name, slug, email, password, phone, address, city, country,
  logo, cover_image, description, website, social_media, business_hours,
  cuisine_type, price_range, rating, total_reviews, verified, verification_token,
  verification_date, pending_approval, timezone, max_requests_per_user,
  queue_limit, auto_play, allow_explicit, is_active, subscription_plan_id,
  subscription_status, subscription_start_date, subscription_end_date,
  subscription_payment_proof, last_login_at, settings, created_at, updated_at
)
SELECT
  id, name, owner_name, slug, email, password, phone, address, city, country,
  logo, cover_image, description, website, social_media, business_hours,
  cuisine_type, price_range, rating, total_reviews, verified, verification_token,
  verification_date, pending_approval, timezone, max_requests_per_user,
  queue_limit, auto_play, allow_explicit, is_active,
  CASE
    WHEN subscription_plan = 'free' THEN 'starter'
    WHEN subscription_plan = 'premium' THEN 'professional'
    WHEN subscription_plan = 'enterprise' THEN 'enterprise'
    ELSE 'starter'
  END as subscription_plan_id,
  'active' as subscription_status,
  created_at as subscription_start_date,
  NULL as subscription_end_date,
  NULL as subscription_payment_proof,
  last_login_at, settings, created_at, updated_at
FROM restaurants_backup
WHERE subscription_plan IS NOT NULL;

-- Insertar restaurantes sin plan de suscripción (asignar starter por defecto)
INSERT INTO restaurants (
  id, name, owner_name, slug, email, password, phone, address, city, country,
  logo, cover_image, description, website, social_media, business_hours,
  cuisine_type, price_range, rating, total_reviews, verified, verification_token,
  verification_date, pending_approval, timezone, max_requests_per_user,
  queue_limit, auto_play, allow_explicit, is_active, subscription_plan_id,
  subscription_status, subscription_start_date, subscription_end_date,
  subscription_payment_proof, last_login_at, settings, created_at, updated_at
)
SELECT
  id, name, owner_name, slug, email, password, phone, address, city, country,
  logo, cover_image, description, website, social_media, business_hours,
  cuisine_type, price_range, rating, total_reviews, verified, verification_token,
  verification_date, pending_approval, timezone, max_requests_per_user,
  queue_limit, auto_play, allow_explicit, is_active,
  'starter' as subscription_plan_id,
  'active' as subscription_status,
  created_at as subscription_start_date,
  NULL as subscription_end_date,
  NULL as subscription_payment_proof,
  last_login_at, settings, created_at, updated_at
FROM restaurants_backup
WHERE subscription_plan IS NULL;

-- Reactivar foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Eliminar tabla temporal
DROP TABLE restaurants_backup;


-- ===============================
-- DATOS DE EJEMPLO COMPLETOS
-- ===============================

-- ==========================================
-- 10 RESTAURANTES VARIADOS
-- ==========================================

INSERT INTO restaurants (id, name, owner_name, slug, email, password, phone, address, city, country, logo, cover_image, description, website, cuisine_type, price_range, timezone, max_requests_per_user, queue_limit, auto_play, allow_explicit, is_active, subscription_plan_id, subscription_status, subscription_start_date, created_at) VALUES

-- Restaurante 1: Terraza Musical (Bogotá)
('rest-001', 'La Terraza Musical', 'Carlos Mendoza', 'la-terraza-musical', 'carlos@laterraza.com', '$2b$10$hashedpassword1', '+57 300 123 4567', 'Carrera 15 #82-36', 'Bogotá', 'Colombia', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop', 'Terraza con ambiente musical único en el corazón de Bogotá', 'https://laterraza.com', 'Colombiana', '$$$', 'America/New_York', 3, 50, true, false, true, 'professional', 'active', '2024-01-15 10:00:00', '2024-01-01 10:00:00'),

-- Restaurante 2: Sabor Cubano (Medellín)
('rest-002', 'Sabor Cubano', 'María Rodríguez', 'sabor-cubano', 'maria@saborcubano.com', '$2b$10$hashedpassword2', '+57 301 234 5678', 'Calle 10 #35-20', 'Medellín', 'Colombia', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop', 'Auténtica comida cubana con ritmos caribeños', 'https://saborcubano.com', 'Cubana', '$$', 'America/New_York', 2, 30, true, false, true, 'starter', 'active', '2024-02-01 10:00:00', '2024-01-15 10:00:00'),

-- Restaurante 3: Jazz & Blues (Cali)
('rest-003', 'Jazz & Blues Corner', 'Roberto Jiménez', 'jazz-blues-corner', 'roberto@jazzblues.com', '$2b$10$hashedpassword3', '+57 302 345 6789', 'Avenida 6N #24-50', 'Cali', 'Colombia', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop', 'Jazz en vivo todas las noches con ambiente sofisticado', 'https://jazzblues.com', 'Internacional', '$$$$', 'America/New_York', 5, 40, true, true, true, 'professional', 'active', '2024-01-20 10:00:00', '2024-01-10 10:00:00'),

-- Restaurante 4: Reggaeton Palace (Barranquilla)
('rest-004', 'Reggaeton Palace', 'Sofia Martínez', 'reggaeton-palace', 'sofia@reggaetonpalace.com', '$2b$10$hashedpassword4', '+57 303 456 7890', 'Calle 84 #46-22', 'Barranquilla', 'Colombia', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop', 'El mejor reggaeton y música urbana de la costa', 'https://reggaetonpalace.com', 'Latina', '$$', 'America/New_York', 4, 60, true, true, true, 'starter', 'active', '2024-02-15 10:00:00', '2024-02-01 10:00:00'),

-- Restaurante 5: Rock & Roll Diner (Cartagena)
('rest-005', 'Rock & Roll Diner', 'Diego Santos', 'rock-roll-diner', 'diego@rockrolldiner.com', '$2b$10$hashedpassword5', '+57 304 567 8901', 'Plaza de la Aduana #3-45', 'Cartagena', 'Colombia', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop', 'Hamburguesas y rock clásico en el corazón histórico', 'https://rockrolldiner.com', 'Americana', '$$', 'America/New_York', 3, 35, true, false, true, 'starter', 'active', '2024-03-01 10:00:00', '2024-02-15 10:00:00'),

-- Restaurante 6: Electronic Lounge (Bogotá)
('rest-006', 'Electronic Lounge', 'Camila López', 'electronic-lounge', 'camila@electroniclounge.com', '$2b$10$hashedpassword6', '+57 305 678 9012', 'Carrera 7 #32-16', 'Bogotá', 'Colombia', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop', 'Música electrónica y ambiente futurista', 'https://electroniclounge.com', 'Fusión', '$$$', 'America/New_York', 3, 45, true, true, true, 'professional', 'active', '2024-01-25 10:00:00', '2024-01-20 10:00:00'),

-- Restaurante 7: Salsa y Son (Medellín)
('rest-007', 'Salsa y Son', 'Miguel Torres', 'salsa-y-son', 'miguel@salsayson.com', '$2b$10$hashedpassword7', '+57 306 789 0123', 'Calle 33 #74-12', 'Medellín', 'Colombia', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop', 'La mejor salsa y son cubano de la ciudad', 'https://salsayson.com', 'Latina', '$$', 'America/New_York', 2, 40, true, false, true, 'starter', 'active', '2024-02-20 10:00:00', '2024-02-10 10:00:00'),

-- Restaurante 8: Indie Café (Cali)
('rest-008', 'Indie Café', 'Lucía Ramírez', 'indie-cafe', 'lucia@indiecafe.com', '$2b$10$hashedpassword8', '+57 307 890 1234', 'Avenida 4N #12-34', 'Cali', 'Colombia', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop', 'Café con música indie y alternativa', 'https://indiecafe.com', 'Cafetería', '$', 'America/New_York', 2, 25, true, false, true, 'starter', 'active', '2024-03-05 10:00:00', '2024-02-25 10:00:00'),

-- Restaurante 9: Hip Hop Corner (Barranquilla)
('rest-009', 'Hip Hop Corner', 'Andrés Morales', 'hip-hop-corner', 'andres@hiphopcorner.com', '$2b$10$hashedpassword9', '+57 308 901 2345', 'Calle 72 #41-18', 'Barranquilla', 'Colombia', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop', 'Hip hop y rap con ambiente urbano', 'https://hiphopcorner.com', 'Urbana', '$$', 'America/New_York', 3, 50, true, true, true, 'starter', 'active', '2024-02-28 10:00:00', '2024-02-20 10:00:00'),

-- Restaurante 10: Classical Bistro (Cartagena)
('rest-010', 'Classical Bistro', 'Isabella Castro', 'classical-bistro', 'isabella@classicalbistro.com', '$2b$10$hashedpassword10', '+57 309 012 3456', 'Centro Histórico #5-23', 'Cartagena', 'Colombia', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop', 'Música clásica y ambiente elegante', 'https://classicalbistro.com', 'Francesa', '$$$$', 'America/New_York', 2, 30, true, false, true, 'enterprise', 'active', '2024-01-30 10:00:00', '2024-01-25 10:00:00');

-- ==========================================
-- USUARIOS REGISTRADOS (15 usuarios)
-- ==========================================

INSERT INTO registered_users (id, name, email, password, phone, avatar, preferred_genres, preferred_languages, is_active, is_premium, email_verified, role, created_at) VALUES
('user-reg-001', 'María González', 'maria@example.com', '$2b$10$hashedpass1', '+57 300 111 2222', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop', '["pop", "rock", "ballad"]', '["es", "en"]', true, true, true, 'user', '2024-01-01 08:00:00'),
('user-reg-002', 'Carlos Rodríguez', 'carlos@example.com', '$2b$10$hashedpass2', '+57 300 222 3333', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', '["electronic", "hip-hop", "reggaeton"]', '["es"]', true, false, true, 'user', '2024-01-02 09:00:00'),
('user-reg-003', 'Ana Martínez', 'ana@example.com', '$2b$10$hashedpass3', '+57 300 333 4444', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', '["jazz", "classical", "ballad"]', '["es", "en"]', true, true, true, 'user', '2024-01-03 10:00:00'),
('user-reg-004', 'Luis Hernández', 'luis@example.com', '$2b$10$hashedpass4', '+57 300 444 5555', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', '["rock", "metal", "punk"]', '["es"]', true, false, true, 'user', '2024-01-04 11:00:00'),
('user-reg-005', 'Carmen López', 'carmen@example.com', '$2b$10$hashedpass5', '+57 300 555 6666', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', '["salsa", "latin", "reggaeton"]', '["es"]', true, true, true, 'user', '2024-01-05 12:00:00'),
('user-reg-006', 'Jorge Ruiz', 'jorge@example.com', '$2b$10$hashedpass6', '+57 300 666 7777', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', '["electronic", "house", "techno"]', '["es", "en"]', true, false, true, 'user', '2024-01-06 13:00:00'),
('user-reg-007', 'Patricia Díaz', 'patricia@example.com', '$2b$10$hashedpass7', '+57 300 777 8888', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', '["pop", "indie", "alternative"]', '["es"]', true, true, true, 'user', '2024-01-07 14:00:00'),
('user-reg-008', 'Roberto Sánchez', 'roberto@example.com', '$2b$10$hashedpass8', '+57 300 888 9999', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', '["jazz", "blues", "soul"]', '["es", "en"]', true, false, true, 'user', '2024-01-08 15:00:00'),
('user-reg-009', 'Elena Morales', 'elena@example.com', '$2b$10$hashedpass9', '+57 300 999 0000', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop', '["classical", "opera", "instrumental"]', '["es"]', true, true, true, 'user', '2024-01-09 16:00:00'),
('user-reg-010', 'Miguel Torres', 'miguel@example.com', '$2b$10$hashedpass10', '+57 301 111 2222', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop', '["reggae", "ska", "world"]', '["es", "en"]', true, false, true, 'user', '2024-01-10 17:00:00'),
('user-reg-011', 'Sofia Castro', 'sofia@example.com', '$2b$10$hashedpass11', '+57 301 222 3333', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop', '["hip-hop", "rap", "trap"]', '["es"]', true, true, true, 'user', '2024-01-11 18:00:00'),
('user-reg-012', 'David Jiménez', 'david@example.com', '$2b$10$hashedpass12', '+57 301 333 4444', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop', '["country", "folk", "bluegrass"]', '["es", "en"]', true, false, true, 'user', '2024-01-12 19:00:00'),
('user-reg-013', 'Laura Vargas', 'laura@example.com', '$2b$10$hashedpass13', '+57 301 444 5555', 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=150&h=150&fit=crop', '["disco", "funk", "soul"]', '["es"]', true, true, true, 'user', '2024-01-13 20:00:00'),
('user-reg-014', 'Alejandro Ruiz', 'alejandro@example.com', '$2b$10$hashedpass14', '+57 301 555 6666', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', '["metal", "hard-rock", "grunge"]', '["es", "en"]', true, false, true, 'user', '2024-01-14 21:00:00'),
('user-reg-015', 'Super Admin', 'admin@restaurantmusic.com', '$2b$10$superadmin123', '+57 301 666 7777', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', '["all"]', '["es", "en"]', true, true, true, 'superadmin', '2024-01-01 00:00:00');

-- ==========================================
-- USUARIOS TEMPORALES (MESAS) - 25 usuarios
-- ==========================================

INSERT INTO users (id, registered_user_id, user_type, restaurant_id, table_number, session_id, name, total_requests, requests_today, ip_address, created_at) VALUES
-- La Terraza Musical (rest-001)
('user-temp-001', NULL, 'registered', 'rest-001', 'Mesa VIP 1', 'session-001', 'María G.', 5, 2, '192.168.1.100', '2024-01-15 18:30:00'),
('user-temp-002', NULL, 'guest', 'rest-001', 'Mesa #5', 'session-002', 'Cliente Mesa 5', 3, 3, '192.168.1.101', '2024-01-15 19:00:00'),
('user-temp-003', NULL, 'guest', 'rest-001', 'Mesa #12', 'session-003', 'Cliente Mesa 12', 1, 1, '192.168.1.102', '2024-01-15 19:15:00'),
('user-temp-004', 'user-reg-003', 'registered', 'rest-001', 'Mesa #8', 'session-004', 'Ana M.', 2, 1, '192.168.1.103', '2024-01-15 19:30:00'),
('user-temp-005', NULL, 'guest', 'rest-001', 'Mesa #15', 'session-005', 'Grupo Amigos', 4, 4, '192.168.1.104', '2024-01-15 20:00:00'),

-- Sabor Cubano (rest-002)
('user-temp-006', 'user-reg-005', 'registered', 'rest-002', 'Mesa #3', 'session-006', 'Carmen L.', 2, 2, '192.168.1.105', '2024-01-15 18:45:00'),
('user-temp-007', NULL, 'guest', 'rest-002', 'Mesa #7', 'session-007', 'Pareja Joven', 1, 1, '192.168.1.106', '2024-01-15 19:20:00'),
('user-temp-008', NULL, 'registered', 'rest-002', 'Mesa #10', 'session-008', 'Carlos R.', 3, 2, '192.168.1.107', '2024-01-15 19:45:00'),

-- Jazz & Blues Corner (rest-003)
('user-temp-009', 'user-reg-008', 'registered', 'rest-003', 'Mesa VIP', 'session-009', 'Roberto S.', 1, 1, '192.168.1.108', '2024-01-15 20:30:00'),
('user-temp-010', 'user-reg-009', 'registered', 'rest-003', 'Mesa #2', 'session-010', 'Elena M.', 2, 1, '192.168.1.109', '2024-01-15 21:00:00'),
('user-temp-011', NULL, 'guest', 'rest-003', 'Mesa #5', 'session-011', 'Jazz Lovers', 1, 1, '192.168.1.110', '2024-01-15 21:30:00'),

-- Reggaeton Palace (rest-004)
('user-temp-012', NULL, 'registered', 'rest-004', 'Mesa #1', 'session-012', 'Sofia C.', 4, 3, '192.168.1.111', '2024-01-15 22:00:00'),
('user-temp-013', NULL, 'guest', 'rest-004', 'Mesa #8', 'session-013', 'Fiesta Group', 6, 6, '192.168.1.112', '2024-01-15 22:30:00'),
('user-temp-014', 'user-reg-013', 'registered', 'rest-004', 'Mesa #12', 'session-014', 'Laura V.', 3, 2, '192.168.1.113', '2024-01-15 23:00:00'),

-- Rock & Roll Diner (rest-005)
('user-temp-015', 'user-reg-004', 'registered', 'rest-005', 'Mesa #4', 'session-015', 'Luis H.', 2, 2, '192.168.1.114', '2024-01-15 19:00:00'),
('user-temp-016', NULL, 'guest', 'rest-005', 'Mesa #7', 'session-016', 'Rock Family', 3, 3, '192.168.1.115', '2024-01-15 19:30:00'),
('user-temp-017', 'user-reg-014', 'registered', 'rest-005', 'Mesa #9', 'session-017', 'Alejandro R.', 1, 1, '192.168.1.116', '2024-01-15 20:00:00'),

-- Electronic Lounge (rest-006)
('user-temp-018', 'user-reg-006', 'registered', 'rest-006', 'Mesa VIP', 'session-018', 'Jorge R.', 2, 2, '192.168.1.117', '2024-01-15 23:00:00'),
('user-temp-019', NULL, 'guest', 'rest-006', 'Mesa #3', 'session-019', 'Night People', 4, 4, '192.168.1.118', '2024-01-15 23:30:00'),
('user-temp-020', 'user-reg-007', 'registered', 'rest-006', 'Mesa #6', 'session-020', 'Patricia D.', 1, 1, '192.168.1.119', '2024-01-16 00:00:00'),

-- Salsa y Son (rest-007)
('user-temp-021', 'user-reg-005', 'registered', 'rest-007', 'Mesa #2', 'session-021', 'Carmen L.', 3, 2, '192.168.1.120', '2024-01-15 20:00:00'),
('user-temp-022', NULL, 'guest', 'rest-007', 'Mesa #5', 'session-022', 'Dance Group', 5, 5, '192.168.1.121', '2024-01-15 20:30:00'),

-- Indie Café (rest-008)
('user-temp-023', 'user-reg-007', 'registered', 'rest-008', 'Mesa #1', 'session-023', 'Patricia D.', 2, 1, '192.168.1.122', '2024-01-15 17:00:00'),
('user-temp-024', NULL, 'guest', 'rest-008', 'Mesa #4', 'session-024', 'Coffee Friends', 1, 1, '192.168.1.123', '2024-01-15 17:30:00'),

-- Hip Hop Corner (rest-009)
('user-temp-025', NULL, 'registered', 'rest-009', 'Mesa #3', 'session-025', 'Sofia C.', 3, 3, '192.168.1.124', '2024-01-15 21:00:00');

-- ==========================================
-- CANCIONES (100 canciones variadas)
-- ==========================================

INSERT INTO songs (id, restaurant_id, title, artist, album, duration, genre, year, popularity, is_explicit, times_requested, created_at) VALUES
-- La Terraza Musical (rest-001) - 15 canciones
('song-001', 'rest-001', 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', '5:55', 'rock', 1975, 95, false, 25, '2024-01-01 10:00:00'),
('song-002', 'rest-001', 'Hotel California', 'Eagles', 'Hotel California', '6:30', 'rock', 1976, 92, false, 18, '2024-01-01 10:05:00'),
('song-003', 'rest-001', 'Blinding Lights', 'The Weeknd', 'After Hours', '3:20', 'pop', 2019, 98, false, 32, '2024-01-01 10:10:00'),
('song-004', 'rest-001', 'Shape of You', 'Ed Sheeran', '÷', '3:53', 'pop', 2017, 96, false, 28, '2024-01-01 10:15:00'),
('song-005', 'rest-001', 'Billie Jean', 'Michael Jackson', 'Thriller', '4:54', 'pop', 1982, 94, false, 22, '2024-01-01 10:20:00'),
('song-006', 'rest-001', 'Sweet Child O\' Mine', 'Guns N\' Roses', 'Appetite for Destruction', '5:03', 'rock', 1987, 93, false, 19, '2024-01-01 10:25:00'),
('song-007', 'rest-001', 'Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'Uptown Special', '4:30', 'funk', 2014, 91, false, 15, '2024-01-01 10:30:00'),
('song-008', 'rest-001', 'Rolling in the Deep', 'Adele', '21', '3:48', 'pop', 2010, 89, false, 12, '2024-01-01 10:35:00'),
('song-009', 'rest-001', 'Don\'t Stop Believin\'', 'Journey', 'Escape', '4:11', 'rock', 1981, 87, false, 10, '2024-01-01 10:40:00'),
('song-010', 'rest-001', 'Bad Guy', 'Billie Eilish', 'When We All Fall Asleep', '3:14', 'pop', 2019, 85, false, 8, '2024-01-01 10:45:00'),
('song-011', 'rest-001', 'Wonderwall', 'Oasis', '(What\'s the Story) Morning Glory?', '4:18', 'rock', 1995, 83, false, 6, '2024-01-01 10:50:00'),
('song-012', 'rest-001', 'Dancing Queen', 'ABBA', 'Arrival', '3:51', 'disco', 1976, 81, false, 5, '2024-01-01 10:55:00'),
('song-013', 'rest-001', 'Take on Me', 'a-ha', 'Hunting High and Low', '3:48', 'pop', 1985, 79, false, 4, '2024-01-01 11:00:00'),
('song-014', 'rest-001', 'Smells Like Teen Spirit', 'Nirvana', 'Nevermind', '5:01', 'grunge', 1991, 77, false, 3, '2024-01-01 11:05:00'),
('song-015', 'rest-001', 'Viva La Vida', 'Coldplay', 'Viva la Vida or Death and All His Friends', '4:01', 'rock', 2008, 75, false, 2, '2024-01-01 11:10:00'),

-- Sabor Cubano (rest-002) - 10 canciones latinas
('song-016', 'rest-002', 'La Vida Es Un Carnaval', 'Celia Cruz', 'Mi Vida Es Cantar', '4:36', 'salsa', 1998, 88, false, 15, '2024-01-02 10:00:00'),
('song-017', 'rest-002', 'Bailando', 'Enrique Iglesias', 'Sex and Love', '4:03', 'latin', 2014, 86, false, 12, '2024-01-02 10:05:00'),
('song-018', 'rest-002', 'Despacito', 'Luis Fonsi ft. Daddy Yankee', 'Vida', '3:48', 'reggaeton', 2017, 84, false, 10, '2024-01-02 10:10:00'),
('song-019', 'rest-002', 'Havana', 'Camila Cabello', 'Camila', '3:37', 'latin', 2017, 82, false, 8, '2024-01-02 10:15:00'),
('song-020', 'rest-002', 'La Macarena', 'Los Del Rio', 'A mí me gusta', '4:12', 'latin', 1995, 80, false, 6, '2024-01-02 10:20:00'),
('song-021', 'rest-002', 'Oye Como Va', 'Santana', 'Abraxas', '4:17', 'latin', 1970, 78, false, 5, '2024-01-02 10:25:00'),
('song-022', 'rest-002', 'Conga', 'Gloria Estefan', 'Primitive Love', '4:15', 'latin', 1985, 76, false, 4, '2024-01-02 10:30:00'),
('song-023', 'rest-002', 'Gasolina', 'Daddy Yankee', 'Barrio Fino', '3:12', 'reggaeton', 2004, 74, false, 3, '2024-01-02 10:35:00'),
('song-024', 'rest-002', 'Suavemente', 'Elvis Crespo', 'Suavemente', '4:27', 'merengue', 1998, 72, false, 2, '2024-01-02 10:40:00'),
('song-025', 'rest-002', 'Livin\' la Vida Loca', 'Ricky Martin', 'Ricky Martin', '4:03', 'latin', 1999, 70, false, 1, '2024-01-02 10:45:00'),

-- Jazz & Blues Corner (rest-003) - 10 canciones jazz
('song-026', 'rest-003', 'What a Wonderful World', 'Louis Armstrong', 'What a Wonderful World', '2:19', 'jazz', 1967, 90, false, 12, '2024-01-03 10:00:00'),
('song-027', 'rest-003', 'Fly Me to the Moon', 'Frank Sinatra', 'It Might as Well Be Swing', '2:27', 'jazz', 1964, 88, false, 10, '2024-01-03 10:05:00'),
('song-028', 'rest-003', 'Autumn Leaves', 'Nat King Cole', 'Autumn Leaves', '2:40', 'jazz', 1955, 86, false, 8, '2024-01-03 10:10:00'),
('song-029', 'rest-003', 'Blue Bossa', 'Joe Henderson', 'Page One', '8:02', 'jazz', 1963, 84, false, 6, '2024-01-03 10:15:00'),
('song-030', 'rest-003', 'So What', 'Miles Davis', 'Kind of Blue', '9:22', 'jazz', 1959, 82, false, 5, '2024-01-03 10:20:00'),
('song-031', 'rest-003', 'Take Five', 'Dave Brubeck', 'Time Out', '5:24', 'jazz', 1959, 80, false, 4, '2024-01-03 10:25:00'),
('song-032', 'rest-003', 'My Funny Valentine', 'Chet Baker', 'Chet Baker Sings', '2:19', 'jazz', 1954, 78, false, 3, '2024-01-03 10:30:00'),
('song-033', 'rest-003', 'Summertime', 'Ella Fitzgerald', 'Porgy and Bess', '4:58', 'jazz', 1957, 76, false, 2, '2024-01-03 10:35:00'),
('song-034', 'rest-003', 'All Blues', 'Miles Davis', 'Kind of Blue', '11:33', 'jazz', 1959, 74, false, 1, '2024-01-03 10:40:00'),
('song-035', 'rest-003', 'In a Sentimental Mood', 'Duke Ellington', 'Duke Ellington Meets Coleman Hawkins', '4:14', 'jazz', 1962, 72, false, 1, '2024-01-03 10:45:00'),

-- Reggaeton Palace (rest-004) - 10 canciones reggaeton
('song-036', 'rest-004', 'Dákiti', 'Bad Bunny & Jhay Cortez', 'El Último Tour Del Mundo', '3:25', 'reggaeton', 2020, 95, true, 20, '2024-01-04 10:00:00'),
('song-037', 'rest-004', 'Tusa', 'Karol G & Nicki Minaj', 'Tusa', '3:20', 'reggaeton', 2019, 93, true, 18, '2024-01-04 10:05:00'),
('song-038', 'rest-004', 'Callaíta', 'Bad Bunny', 'Oasis', '4:10', 'reggaeton', 2019, 91, true, 15, '2024-01-04 10:10:00'),
('song-039', 'rest-004', 'China', 'Anuel AA, Daddy Yankee', 'Emmanuel', '5:01', 'reggaeton', 2019, 89, true, 12, '2024-01-04 10:15:00'),
('song-040', 'rest-004', 'Que Tire Pa Lante', 'Daddy Yankee', 'Legendaddy', '3:30', 'reggaeton', 2022, 87, false, 10, '2024-01-04 10:20:00'),
('song-041', 'rest-004', 'Pepas', 'Farruko', 'La 167', '4:47', 'reggaeton', 2021, 85, true, 8, '2024-01-04 10:25:00'),
('song-042', 'rest-004', 'Reloj', 'Rauw Alejandro', 'Vice Versa', '3:58', 'reggaeton', 2021, 83, true, 6, '2024-01-04 10:30:00'),
('song-043', 'rest-004', 'Todo De Ti', 'Rauw Alejandro', 'Vice Versa', '3:19', 'reggaeton', 2021, 81, false, 5, '2024-01-04 10:35:00'),
('song-044', 'rest-004', 'Yonaguni', 'Bad Bunny', 'Yonaguni', '3:26', 'reggaeton', 2021, 79, true, 4, '2024-01-04 10:40:00'),
('song-045', 'rest-004', 'Bichota', 'Karol G', 'KG0516', '2:58', 'reggaeton', 2020, 77, true, 3, '2024-01-04 10:45:00'),

-- Rock & Roll Diner (rest-005) - 10 canciones rock
('song-046', 'rest-005', 'Stairway to Heaven', 'Led Zeppelin', 'Led Zeppelin IV', '8:02', 'rock', 1971, 92, false, 15, '2024-01-05 10:00:00'),
('song-047', 'rest-005', 'Back in Black', 'AC/DC', 'Back in Black', '4:15', 'rock', 1980, 90, false, 12, '2024-01-05 10:05:00'),
('song-048', 'rest-005', 'Thunderstruck', 'AC/DC', 'The Razors Edge', '4:52', 'rock', 1990, 88, false, 10, '2024-01-05 10:10:00'),
('song-049', 'rest-005', 'Highway to Hell', 'AC/DC', 'Highway to Hell', '3:28', 'rock', 1979, 86, false, 8, '2024-01-05 10:15:00'),
('song-050', 'rest-005', 'We Will Rock You', 'Queen', 'News of the World', '2:01', 'rock', 1977, 84, false, 6, '2024-01-05 10:20:00'),
('song-051', 'rest-005', 'Enter Sandman', 'Metallica', 'Metallica', '5:31', 'metal', 1991, 82, false, 5, '2024-01-05 10:25:00'),
('song-052', 'rest-005', 'Nothing Else Matters', 'Metallica', 'Metallica', '6:28', 'metal', 1991, 80, false, 4, '2024-01-05 10:30:00'),
('song-053', 'rest-005', 'November Rain', 'Guns N\' Roses', 'Use Your Illusion I', '8:57', 'rock', 1991, 78, false, 3, '2024-01-05 10:35:00'),
('song-054', 'rest-005', 'Dream On', 'Aerosmith', 'Aerosmith', '4:26', 'rock', 1973, 76, false, 2, '2024-01-05 10:40:00'),
('song-055', 'rest-005', 'Free Bird', 'Lynyrd Skynyrd', '(Pronounced \'Lĕh-\'nérd \'Skin-\'nérd)', '9:08', 'rock', 1973, 74, false, 1, '2024-01-05 10:45:00'),

-- Electronic Lounge (rest-006) - 10 canciones electronic
('song-056', 'rest-006', 'Levels', 'Avicii', 'Levels', '5:38', 'electronic', 2011, 90, false, 12, '2024-01-06 10:00:00'),
('song-057', 'rest-006', 'Titanium', 'David Guetta ft. Sia', 'Nothing but the Beat', '4:05', 'electronic', 2011, 88, false, 10, '2024-01-06 10:05:00'),
('song-058', 'rest-006', 'Animals', 'Martin Garrix', 'Animals', '5:03', 'electronic', 2013, 86, false, 8, '2024-01-06 10:10:00'),
('song-059', 'rest-006', 'Wake Me Up', 'Avicii', 'True', '4:07', 'electronic', 2013, 84, false, 6, '2024-01-06 10:15:00'),
('song-060', 'rest-006', 'Don\'t You Worry Child', 'Swedish House Mafia', 'Until Now', '6:43', 'electronic', 2012, 82, false, 5, '2024-01-06 10:20:00'),
('song-061', 'rest-006', 'Clarity', 'Zedd ft. Foxes', 'Clarity', '4:31', 'electronic', 2012, 80, false, 4, '2024-01-06 10:25:00'),
('song-062', 'rest-006', 'Spectrum', 'Zedd', 'Clarity', '4:03', 'electronic', 2012, 78, false, 3, '2024-01-06 10:30:00'),
('song-063', 'rest-006', 'Feel This Moment', 'Pitbull ft. Christina Aguilera', 'Global Warming', '3:49', 'electronic', 2013, 76, false, 2, '2024-01-06 10:35:00'),
('song-064', 'rest-006', 'I Could Be The One', 'Avicii vs Nicky Romero', 'I Could Be The One', '7:35', 'electronic', 2012, 74, false, 1, '2024-01-06 10:40:00'),
('song-065', 'rest-006', 'Reload', 'Sebastian Ingrosso & Tommy Trash', 'Reload', '6:02', 'electronic', 2013, 72, false, 1, '2024-01-06 10:45:00'),

-- Salsa y Son (rest-007) - 10 canciones salsa
('song-066', 'rest-007', 'El Cantante', 'Héctor Lavoe', 'El Cantante', '10:26', 'salsa', 1978, 85, false, 10, '2024-01-07 10:00:00'),
('song-067', 'rest-007', 'Pedro Navaja', 'Rubén Blades', 'Siembra', '7:21', 'salsa', 1978, 83, false, 8, '2024-01-07 10:05:00'),
('song-068', 'rest-007', 'Llorarás', 'Oscar D\'León', 'Llorarás', '5:05', 'salsa', 1975, 81, false, 6, '2024-01-07 10:10:00'),
('song-069', 'rest-007', 'Aguanile', 'Héctor Lavoe', 'La Voz', '6:15', 'salsa', 1975, 79, false, 5, '2024-01-07 10:15:00'),
('song-070', 'rest-007', 'Cali Pachanguero', 'Grupo Niche', 'Cali Pachanguero', '5:48', 'salsa', 1984, 77, false, 4, '2024-01-07 10:20:00'),
('song-071', 'rest-007', 'La Rebelión', 'Joe Arroyo', 'Reinventando la Salsa', '4:42', 'salsa', 1988, 75, false, 3, '2024-01-07 10:25:00'),
('song-072', 'rest-007', 'Periódico de Ayer', 'Héctor Lavoe', 'Periódico de Ayer', '6:49', 'salsa', 1987, 73, false, 2, '2024-01-07 10:30:00'),
('song-073', 'rest-007', 'Yambeque', 'La Sonora Ponceña', 'Yambeque', '6:32', 'salsa', 1975, 71, false, 1, '2024-01-07 10:35:00'),
('song-074', 'rest-007', 'Anacaona', 'Cheo Feliciano', 'Anacaona', '5:33', 'salsa', 1972, 69, false, 1, '2024-01-07 10:40:00'),
('song-075', 'rest-007', 'Quítate Tú', 'Fania All-Stars', 'Live at Yankee Stadium', '5:47', 'salsa', 1975, 67, false, 1, '2024-01-07 10:45:00'),

-- Indie Café (rest-008) - 10 canciones indie
('song-076', 'rest-008', 'Ho Hey', 'The Lumineers', 'The Lumineers', '2:43', 'indie', 2012, 82, false, 8, '2024-01-08 10:00:00'),
('song-077', 'rest-008', 'Riptide', 'Vance Joy', 'Dream Your Life Away', '3:24', 'indie', 2013, 80, false, 6, '2024-01-08 10:05:00'),
('song-078', 'rest-008', 'Home', 'Edward Sharpe & The Magnetic Zeros', 'Up from Below', '5:03', 'indie', 2009, 78, false, 5, '2024-01-08 10:10:00'),
('song-079', 'rest-008', 'Little Talks', 'Of Monsters and Men', 'My Head Is an Animal', '4:26', 'indie', 2011, 76, false, 4, '2024-01-08 10:15:00'),
('song-080', 'rest-008', 'Electric Feel', 'MGMT', 'Oracular Spectacular', '3:49', 'indie', 2007, 74, false, 3, '2024-01-08 10:20:00'),
('song-081', 'rest-008', 'Float On', 'Modest Mouse', 'Good News for People Who Love Bad News', '3:28', 'indie', 2004, 72, false, 2, '2024-01-08 10:25:00'),
('song-082', 'rest-008', 'Yellow', 'Coldplay', 'Parachutes', '4:29', 'indie', 2000, 70, false, 1, '2024-01-08 10:30:00'),
('song-083', 'rest-008', 'Last Nite', 'The Strokes', 'Is This It', '3:13', 'indie', 2001, 68, false, 1, '2024-01-08 10:35:00'),
('song-084', 'rest-008', 'Mr. Brightside', 'The Killers', 'Hot Fuss', '3:43', 'indie', 2004, 66, false, 1, '2024-01-08 10:40:00'),
('song-085', 'rest-008', 'Take Me Out', 'Franz Ferdinand', 'Franz Ferdinand', '3:57', 'indie', 2004, 64, false, 1, '2024-01-08 10:45:00'),

-- Hip Hop Corner (rest-009) - 10 canciones hip hop
('song-086', 'rest-009', 'Lose Yourself', 'Eminem', '8 Mile', '5:26', 'hip-hop', 2002, 88, true, 12, '2024-01-09 10:00:00'),
('song-087', 'rest-009', 'Stronger', 'Kanye West', 'Graduation', '5:12', 'hip-hop', 2007, 86, true, 10, '2024-01-09 10:05:00'),
('song-088', 'rest-009', 'In Da Club', '50 Cent', 'Get Rich or Die Tryin\'', '3:13', 'hip-hop', 2003, 84, true, 8, '2024-01-09 10:10:00'),
('song-089', 'rest-009', 'Yeah!', 'Usher ft. Lil Jon & Ludacris', 'Confessions', '4:10', 'hip-hop', 2004, 82, true, 6, '2024-01-09 10:15:00'),
('song-090', 'rest-009', 'Hotline Bling', 'Drake', 'Views', '4:27', 'hip-hop', 2015, 80, true, 5, '2024-01-09 10:20:00'),
('song-091', 'rest-009', 'Sicko Mode', 'Travis Scott', 'Astroworld', '5:12', 'hip-hop', 2018, 78, true, 4, '2024-01-09 10:25:00'),
('song-092', 'rest-009', 'God\'s Plan', 'Drake', 'Scorpion', '3:18', 'hip-hop', 2018, 76, false, 3, '2024-01-09 10:30:00'),
('song-093', 'rest-009', 'Rockstar', 'Post Malone ft. 21 Savage', 'Beerbongs & Bentleys', '3:38', 'hip-hop', 2017, 74, true, 2, '2024-01-09 10:35:00'),
('song-094', 'rest-009', 'Humble', 'Kendrick Lamar', 'Damn', '2:57', 'hip-hop', 2017, 72, true, 1, '2024-01-09 10:40:00'),
('song-095', 'rest-009', 'Bad and Boujee', 'Migos ft. Lil Uzi Vert', 'Culture', '5:43', 'hip-hop', 2016, 70, true, 1, '2024-01-09 10:45:00'),

-- Classical Bistro (rest-010) - 10 canciones clásicas
('song-096', 'rest-010', 'Clair de Lune', 'Claude Debussy', 'Suite Bergamasque', '4:45', 'classical', 1905, 80, false, 8, '2024-01-10 10:00:00'),
('song-097', 'rest-010', 'The Four Seasons - Spring', 'Antonio Vivaldi', 'The Four Seasons', '10:30', 'classical', 1725, 78, false, 6, '2024-01-10 10:05:00'),
('song-098', 'rest-010', 'Moonlight Sonata', 'Ludwig van Beethoven', 'Piano Sonata No. 14', '15:03', 'classical', 1801, 76, false, 5, '2024-01-10 10:10:00'),
('song-099', 'rest-010', 'Canon in D', 'Johann Pachelbel', 'Canon and Gigue in D major', '6:15', 'classical', 1680, 74, false, 4, '2024-01-10 10:15:00'),
('song-100', 'rest-010', 'Für Elise', 'Ludwig van Beethoven', 'Bagatelle No. 25', '2:51', 'classical', 1810, 72, false, 3, '2024-01-10 10:20:00');


-- ==========================================
-- PETICIONES ACTIVAS (30 peticiones)
-- ==========================================

INSERT INTO requests (id, restaurant_id, user_id, song_id, status, queue_position, user_table, requested_at, created_at) VALUES
-- La Terraza Musical - Peticiones activas
('req-001', 'rest-001', 'user-temp-001', 'song-001', 'playing', 1, 'Mesa VIP 1', '2024-01-15 18:35:00', '2024-01-15 18:35:00'),
('req-002', 'rest-001', 'user-temp-002', 'song-003', 'pending', 2, 'Mesa #5', '2024-01-15 19:05:00', '2024-01-15 19:05:00'),
('req-003', 'rest-001', 'user-temp-003', 'song-005', 'pending', 3, 'Mesa #12', '2024-01-15 19:20:00', '2024-01-15 19:20:00'),
('req-004', 'rest-001', 'user-temp-004', 'song-007', 'pending', 4, 'Mesa #8', '2024-01-15 19:35:00', '2024-01-15 19:35:00'),
('req-005', 'rest-001', 'user-temp-005', 'song-002', 'completed', 0, 'Mesa #15', '2024-01-15 20:05:00', '2024-01-15 20:05:00'),

-- Sabor Cubano - Peticiones activas
('req-006', 'rest-002', 'user-temp-006', 'song-016', 'playing', 1, 'Mesa #3', '2024-01-15 18:50:00', '2024-01-15 18:50:00'),
('req-007', 'rest-002', 'user-temp-007', 'song-018', 'pending', 2, 'Mesa #7', '2024-01-15 19:25:00', '2024-01-15 19:25:00'),
('req-008', 'rest-002', 'user-temp-008', 'song-020', 'pending', 3, 'Mesa #10', '2024-01-15 19:50:00', '2024-01-15 19:50:00'),

-- Jazz & Blues Corner - Peticiones activas
('req-009', 'rest-003', 'user-temp-009', 'song-026', 'playing', 1, 'Mesa VIP', '2024-01-15 20:35:00', '2024-01-15 20:35:00'),
('req-010', 'rest-003', 'user-temp-010', 'song-028', 'pending', 2, 'Mesa #2', '2024-01-15 21:05:00', '2024-01-15 21:05:00'),
('req-011', 'rest-003', 'user-temp-011', 'song-030', 'pending', 3, 'Mesa #5', '2024-01-15 21:35:00', '2024-01-15 21:35:00'),

-- Reggaeton Palace - Peticiones activas
('req-012', 'rest-004', 'user-temp-012', 'song-036', 'playing', 1, 'Mesa #1', '2024-01-15 22:05:00', '2024-01-15 22:05:00'),
('req-013', 'rest-004', 'user-temp-013', 'song-038', 'pending', 2, 'Mesa #8', '2024-01-15 22:35:00', '2024-01-15 22:35:00'),
('req-014', 'rest-004', 'user-temp-014', 'song-040', 'pending', 3, 'Mesa #12', '2024-01-15 23:05:00', '2024-01-15 23:05:00'),
('req-015', 'rest-004', 'user-temp-013', 'song-042', 'pending', 4, 'Mesa #8', '2024-01-15 22:40:00', '2024-01-15 22:40:00'),

-- Rock & Roll Diner - Peticiones activas
('req-016', 'rest-005', 'user-temp-015', 'song-046', 'playing', 1, 'Mesa #4', '2024-01-15 19:05:00', '2024-01-15 19:05:00'),
('req-017', 'rest-005', 'user-temp-016', 'song-048', 'pending', 2, 'Mesa #7', '2024-01-15 19:35:00', '2024-01-15 19:35:00'),
('req-018', 'rest-005', 'user-temp-017', 'song-050', 'pending', 3, 'Mesa #9', '2024-01-15 20:05:00', '2024-01-15 20:05:00'),

-- Electronic Lounge - Peticiones activas
('req-019', 'rest-006', 'user-temp-018', 'song-056', 'playing', 1, 'Mesa VIP', '2024-01-15 23:05:00', '2024-01-15 23:05:00'),
('req-020', 'rest-006', 'user-temp-019', 'song-058', 'pending', 2, 'Mesa #3', '2024-01-15 23:35:00', '2024-01-15 23:35:00'),
('req-021', 'rest-006', 'user-temp-020', 'song-060', 'pending', 3, 'Mesa #6', '2024-01-16 00:05:00', '2024-01-16 00:05:00'),

-- Salsa y Son - Peticiones activas
('req-022', 'rest-007', 'user-temp-021', 'song-066', 'playing', 1, 'Mesa #2', '2024-01-15 20:05:00', '2024-01-15 20:05:00'),
('req-023', 'rest-007', 'user-temp-022', 'song-068', 'pending', 2, 'Mesa #5', '2024-01-15 20:35:00', '2024-01-15 20:35:00'),
('req-024', 'rest-007', 'user-temp-021', 'song-070', 'pending', 3, 'Mesa #2', '2024-01-15 20:10:00', '2024-01-15 20:10:00'),

-- Indie Café - Peticiones activas
('req-025', 'rest-008', 'user-temp-023', 'song-076', 'playing', 1, 'Mesa #1', '2024-01-15 17:05:00', '2024-01-15 17:05:00'),
('req-026', 'rest-008', 'user-temp-024', 'song-078', 'pending', 2, 'Mesa #4', '2024-01-15 17:35:00', '2024-01-15 17:35:00'),

-- Hip Hop Corner - Peticiones activas
('req-027', 'rest-009', 'user-temp-025', 'song-086', 'playing', 1, 'Mesa #3', '2024-01-15 21:05:00', '2024-01-15 21:05:00'),
('req-028', 'rest-009', 'user-temp-025', 'song-088', 'pending', 2, 'Mesa #3', '2024-01-15 21:10:00', '2024-01-15 21:10:00'),

-- Classical Bistro - Peticiones activas
('req-029', 'rest-010', 'user-temp-009', 'song-096', 'playing', 1, 'Mesa #1', '2024-01-15 19:30:00', '2024-01-15 19:30:00'),
('req-030', 'rest-010', 'user-temp-010', 'song-098', 'pending', 2, 'Mesa #2', '2024-01-15 19:45:00', '2024-01-15 19:45:00');

-- ==========================================
-- FAVORITOS (30 favoritos)
-- ==========================================

INSERT INTO favorites (id, user_id, registered_user_id, song_id, restaurant_id, favorite_type, notes, play_count, created_at) VALUES
-- Favoritos permanentes de usuarios registrados
('fav-001', NULL, NULL, 'song-001', 'rest-001', 'permanent', 'Mi canción favorita de Queen', 5, '2024-01-10 10:00:00'),
('fav-002', NULL, NULL, 'song-003', 'rest-001', 'permanent', 'Perfecta para bailar', 3, '2024-01-10 10:05:00'),
('fav-003', NULL, NULL, 'song-036', 'rest-004', 'permanent', 'La mejor de Bad Bunny', 4, '2024-01-10 10:10:00'),
('fav-004', NULL, 'user-reg-003', 'song-026', 'rest-003', 'permanent', 'Clásico del jazz', 2, '2024-01-10 10:15:00'),
('fav-005', NULL, 'user-reg-004', 'song-046', 'rest-005', 'permanent', 'El mejor solo de guitarra', 6, '2024-01-10 10:20:00'),
('fav-006', NULL, 'user-reg-005', 'song-016', 'rest-002', 'permanent', 'Me hace bailar siempre', 3, '2024-01-10 10:25:00'),
('fav-007', NULL, 'user-reg-006', 'song-056', 'rest-006', 'permanent', 'Energía pura', 4, '2024-01-10 10:30:00'),
('fav-008', NULL, 'user-reg-007', 'song-076', 'rest-008', 'permanent', 'Perfecta para el café', 2, '2024-01-10 10:35:00'),
('fav-009', NULL, 'user-reg-008', 'song-027', 'rest-003', 'permanent', 'La voz de Sinatra es mágica', 3, '2024-01-10 10:40:00'),
('fav-010', NULL, 'user-reg-009', 'song-096', 'rest-010', 'permanent', 'Paz absoluta', 2, '2024-01-10 10:45:00'),

-- Favoritos de sesión (usuarios temporales)
('fav-011', 'user-temp-001', NULL, 'song-005', 'rest-001', 'session', 'Increíble canción', 1, '2024-01-15 18:40:00'),
('fav-012', 'user-temp-002', NULL, 'song-007', 'rest-001', 'session', 'Me encanta el ritmo', 1, '2024-01-15 19:10:00'),
('fav-013', 'user-temp-006', NULL, 'song-018', 'rest-002', 'session', 'Perfecta para bailar', 1, '2024-01-15 18:55:00'),
('fav-014', 'user-temp-009', NULL, 'song-028', 'rest-003', 'session', 'Jazz puro', 1, '2024-01-15 20:40:00'),
('fav-015', 'user-temp-012', NULL, 'song-038', 'rest-004', 'session', 'Energía total', 1, '2024-01-15 22:10:00'),
('fav-016', 'user-temp-015', NULL, 'song-048', 'rest-005', 'session', 'Rock clásico', 1, '2024-01-15 19:10:00'),
('fav-017', 'user-temp-018', NULL, 'song-058', 'rest-006', 'session', 'Electronic perfecto', 1, '2024-01-15 23:10:00'),
('fav-018', 'user-temp-021', NULL, 'song-068', 'rest-007', 'session', 'Salsa increíble', 1, '2024-01-15 20:10:00'),
('fav-019', 'user-temp-023', NULL, 'song-078', 'rest-008', 'session', 'Indie perfecto', 1, '2024-01-15 17:10:00'),
('fav-020', 'user-temp-025', NULL, 'song-088', 'rest-009', 'session', 'Hip hop genial', 1, '2024-01-15 21:10:00'),

-- Más favoritos permanentes
('fav-021', NULL, 'user-reg-010', 'song-071', 'rest-007', 'permanent', 'La mejor salsa', 3, '2024-01-10 10:50:00'),
('fav-022', NULL, NULL, 'song-086', 'rest-009', 'permanent', 'Motivación total', 4, '2024-01-10 10:55:00'),
('fav-023', NULL, 'user-reg-012', 'song-051', 'rest-005', 'permanent', 'Heavy metal clásico', 2, '2024-01-10 11:00:00'),
('fav-024', NULL, 'user-reg-013', 'song-061', 'rest-006', 'permanent', 'Electronic mágico', 3, '2024-01-10 11:05:00'),
('fav-025', NULL, 'user-reg-014', 'song-091', 'rest-009', 'permanent', 'Trap perfecto', 2, '2024-01-10 11:10:00'),
('fav-026', NULL, 'user-reg-015', 'song-099', 'rest-010', 'permanent', 'Clásico eterno', 1, '2024-01-10 11:15:00'),
('fav-027', NULL, NULL, 'song-015', 'rest-001', 'permanent', 'Coldplay genial', 2, '2024-01-10 11:20:00'),
('fav-028', NULL, NULL, 'song-040', 'rest-004', 'permanent', 'Daddy Yankee forever', 3, '2024-01-10 11:25:00'),
('fav-029', NULL, 'user-reg-003', 'song-032', 'rest-003', 'permanent', 'Jazz instrumental', 1, '2024-01-10 11:30:00'),
('fav-030', NULL, 'user-reg-004', 'song-053', 'rest-005', 'permanent', 'Guns N\' Roses', 2, '2024-01-10 11:35:00');

-- ==========================================
-- PLAYLISTS (10 playlists)
-- ==========================================

INSERT INTO playlists (id, registered_user_id, name, description, cover_image, is_public, is_collaborative, created_at) VALUES
('playlist-001', 'user-reg-001', 'Mis Clásicos Favoritos', 'Las mejores canciones clásicas de todos los tiempos', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', true, false, '2024-01-10 12:00:00'),
('playlist-002', 'user-reg-002', 'Reggaeton 2024', 'Lo mejor del reggaeton actual', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', true, false, '2024-01-10 12:05:00'),
('playlist-003', 'user-reg-003', 'Jazz para Relajarse', 'Jazz suave para momentos de paz', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', false, false, '2024-01-10 12:10:00'),
('playlist-004', 'user-reg-004', 'Rock Legends', 'Las leyendas del rock', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=300&fit=crop', true, false, '2024-01-10 12:15:00'),
('playlist-005', 'user-reg-005', 'Fiesta Latina', 'Para bailar toda la noche', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop', true, true, '2024-01-10 12:20:00'),
('playlist-006', 'user-reg-006', 'Electronic Energy', 'Música electrónica para energizar', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop', false, false, '2024-01-10 12:25:00'),
('playlist-007', 'user-reg-007', 'Indie Vibes', 'Música indie para el alma', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=300&fit=crop', true, false, '2024-01-10 12:30:00'),
('playlist-008', 'user-reg-008', 'Blues & Soul', 'Blues y soul para el corazón', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', false, false, '2024-01-10 12:35:00'),
('playlist-009', 'user-reg-009', 'Classical Peace', 'Música clásica para meditar', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop', true, false, '2024-01-10 12:40:00'),
('playlist-010', 'user-reg-010', 'World Music', 'Música del mundo para viajar', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', true, true, '2024-01-10 12:45:00');

-- ==========================================
-- CANCIONES EN PLAYLISTS
-- ==========================================

INSERT INTO playlist_songs (id, playlist_id, song_id, position, added_by, added_at) VALUES
-- Playlist 1: Mis Clásicos Favoritos
('ps-001', 'playlist-001', 'song-001', 1, 'user-reg-001', '2024-01-10 12:00:00'),
('ps-002', 'playlist-001', 'song-002', 2, 'user-reg-001', '2024-01-10 12:00:00'),
('ps-003', 'playlist-001', 'song-005', 3, 'user-reg-001', '2024-01-10 12:00:00'),
('ps-004', 'playlist-001', 'song-007', 4, 'user-reg-001', '2024-01-10 12:00:00'),
('ps-005', 'playlist-001', 'song-015', 5, 'user-reg-001', '2024-01-10 12:00:00'),

-- Playlist 2: Reggaeton 2024
('ps-006', 'playlist-002', 'song-036', 1, 'user-reg-002', '2024-01-10 12:05:00'),
('ps-007', 'playlist-002', 'song-037', 2, 'user-reg-002', '2024-01-10 12:05:00'),
('ps-008', 'playlist-002', 'song-038', 3, 'user-reg-002', '2024-01-10 12:05:00'),
('ps-009', 'playlist-002', 'song-040', 4, 'user-reg-002', '2024-01-10 12:05:00'),
('ps-010', 'playlist-002', 'song-042', 5, 'user-reg-002', '2024-01-10 12:05:00'),

-- Playlist 3: Jazz para Relajarse
('ps-011', 'playlist-003', 'song-026', 1, 'user-reg-003', '2024-01-10 12:10:00'),
('ps-012', 'playlist-003', 'song-027', 2, 'user-reg-003', '2024-01-10 12:10:00'),
('ps-013', 'playlist-003', 'song-028', 3, 'user-reg-003', '2024-01-10 12:10:00'),
('ps-014', 'playlist-003', 'song-032', 4, 'user-reg-003', '2024-01-10 12:10:00'),
('ps-015', 'playlist-003', 'song-035', 5, 'user-reg-003', '2024-01-10 12:10:00'),

-- Playlist 4: Rock Legends
('ps-016', 'playlist-004', 'song-046', 1, 'user-reg-004', '2024-01-10 12:15:00'),
('ps-017', 'playlist-004', 'song-047', 2, 'user-reg-004', '2024-01-10 12:15:00'),
('ps-018', 'playlist-004', 'song-048', 3, 'user-reg-004', '2024-01-10 12:15:00'),
('ps-019', 'playlist-004', 'song-051', 4, 'user-reg-004', '2024-01-10 12:15:00'),
('ps-020', 'playlist-004', 'song-053', 5, 'user-reg-004', '2024-01-10 12:15:00'),

-- Playlist 5: Fiesta Latina (colaborativa)
('ps-021', 'playlist-005', 'song-016', 1, 'user-reg-005', '2024-01-10 12:20:00'),
('ps-022', 'playlist-005', 'song-017', 2, 'user-reg-005', '2024-01-10 12:20:00'),
('ps-023', 'playlist-005', 'song-018', 3, 'user-reg-005', '2024-01-10 12:20:00'),
('ps-024', 'playlist-005', 'song-020', 4, 'user-reg-005', '2024-01-10 12:20:00'),
('ps-025', 'playlist-005', 'song-022', 5, 'user-reg-005', '2024-01-10 12:20:00');

-- ==========================================
-- HISTORIAL DE REPRODUCCIÓN (30 entradas)
-- ==========================================

INSERT INTO listening_history (id, registered_user_id, song_id, restaurant_id, played_at, play_duration, was_completed, device_info) VALUES
('lh-001', 'user-reg-001', 'song-001', 'rest-001', '2024-01-15 18:35:00', 355, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-002', 'user-reg-001', 'song-003', 'rest-001', '2024-01-15 18:40:00', 200, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-003', 'user-reg-002', 'song-036', 'rest-004', '2024-01-15 22:05:00', 205, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-004', 'user-reg-003', 'song-026', 'rest-003', '2024-01-15 20:35:00', 139, true, '{"device": "desktop", "os": "Windows", "browser": "Chrome"}'),
('lh-005', 'user-reg-004', 'song-046', 'rest-005', '2024-01-15 19:05:00', 482, true, '{"device": "mobile", "os": "Android", "browser": "Firefox"}'),
('lh-006', 'user-reg-005', 'song-016', 'rest-002', '2024-01-15 18:50:00', 276, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-007', 'user-reg-006', 'song-056', 'rest-006', '2024-01-15 23:05:00', 338, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-008', 'user-reg-007', 'song-076', 'rest-008', '2024-01-15 17:05:00', 163, true, '{"device": "desktop", "os": "macOS", "browser": "Safari"}'),
('lh-009', 'user-reg-008', 'song-027', 'rest-003', '2024-01-15 20:40:00', 147, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-010', 'user-reg-009', 'song-096', 'rest-010', '2024-01-15 19:30:00', 285, true, '{"device": "desktop", "os": "Windows", "browser": "Chrome"}'),
('lh-011', 'user-reg-010', 'song-071', 'rest-007', '2024-01-15 20:05:00', 348, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-012', 'user-reg-008', 'song-086', 'rest-009', '2024-01-15 21:05:00', 326, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-013', 'user-reg-012', 'song-051', 'rest-005', '2024-01-15 19:10:00', 331, true, '{"device": "mobile", "os": "Android", "browser": "Firefox"}'),
('lh-014', 'user-reg-013', 'song-061', 'rest-006', '2024-01-15 23:10:00', 271, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-015', 'user-reg-014', 'song-091', 'rest-009', '2024-01-15 21:10:00', 312, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-016', 'user-reg-015', 'song-099', 'rest-010', '2024-01-15 19:35:00', 375, true, '{"device": "desktop", "os": "Windows", "browser": "Chrome"}'),
('lh-017', 'user-reg-001', 'song-015', 'rest-001', '2024-01-15 18:45:00', 241, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-018', 'user-reg-002', 'song-040', 'rest-004', '2024-01-15 22:10:00', 210, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-019', 'user-reg-003', 'song-032', 'rest-003', '2024-01-15 20:45:00', 139, true, '{"device": "desktop", "os": "Windows", "browser": "Chrome"}'),
('lh-020', 'user-reg-004', 'song-053', 'rest-005', '2024-01-15 19:15:00', 537, true, '{"device": "mobile", "os": "Android", "browser": "Firefox"}'),
('lh-021', 'user-reg-005', 'song-022', 'rest-002', '2024-01-15 18:55:00', 275, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-022', 'user-reg-006', 'song-060', 'rest-006', '2024-01-15 23:15:00', 403, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-023', 'user-reg-007', 'song-080', 'rest-008', '2024-01-15 17:15:00', 229, true, '{"device": "desktop", "os": "macOS", "browser": "Safari"}'),
('lh-024', 'user-reg-008', 'song-029', 'rest-003', '2024-01-15 20:50:00', 502, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-025', 'user-reg-009', 'song-098', 'rest-010', '2024-01-15 19:40:00', 903, true, '{"device": "desktop", "os": "Windows", "browser": "Chrome"}'),
('lh-026', 'user-reg-010', 'song-073', 'rest-007', '2024-01-15 20:15:00', 392, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-027', 'user-reg-008', 'song-090', 'rest-009', '2024-01-15 21:15:00', 267, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}'),
('lh-028', 'user-reg-012', 'song-055', 'rest-005', '2024-01-15 19:20:00', 548, true, '{"device": "mobile", "os": "Android", "browser": "Firefox"}'),
('lh-029', 'user-reg-013', 'song-065', 'rest-006', '2024-01-15 23:20:00', 362, true, '{"device": "mobile", "os": "Android", "browser": "Chrome"}'),
('lh-030', 'user-reg-014', 'song-095', 'rest-009', '2024-01-15 21:20:00', 343, true, '{"device": "mobile", "os": "iOS", "browser": "Safari"}');

-- ==========================================
-- REVIEWS DE RESTAURANTES (15 reviews)
-- ==========================================

INSERT INTO restaurant_reviews (id, restaurant_id, registered_user_id, rating, title, comment, music_quality_rating, service_rating, ambiance_rating, is_anonymous, helpful_votes, created_at) VALUES
('review-001', 'rest-001', 'user-reg-001', 5, 'Excelente experiencia musical', 'La Terraza Musical es increíble. La música es perfecta y el ambiente es genial. Definitivamente volveré.', 5, 5, 5, false, 3, '2024-01-12 10:00:00'),
('review-002', 'rest-001', 'user-reg-003', 4, 'Buena música, buen ambiente', 'Me encantó la selección musical. Las canciones clásicas son perfectas para el lugar.', 5, 4, 4, false, 1, '2024-01-12 11:00:00'),
('review-003', 'rest-002', 'user-reg-005', 5, '¡Auténtico sabor cubano!', 'La música latina es perfecta para acompañar la comida cubana. Ambiente festivo y alegre.', 5, 5, 5, false, 2, '2024-01-12 12:00:00'),
('review-004', 'rest-003', 'user-reg-008', 5, 'Jazz de primera calidad', 'El ambiente de jazz es sofisticado y la música es excepcional. Perfecto para una noche romántica.', 5, 5, 5, false, 4, '2024-01-12 13:00:00'),
('review-005', 'rest-003', 'user-reg-009', 4, 'Excelente para amantes del jazz', 'La música es impecable, aunque el lugar puede ser un poco ruidoso cuando está lleno.', 5, 4, 4, false, 1, '2024-01-12 14:00:00'),
('review-006', 'rest-004', 'user-reg-002', 5, '¡La mejor fiesta!', 'Reggaeton Palace es el lugar perfecto para bailar toda la noche. Energía increíble.', 5, 5, 5, false, 5, '2024-01-12 15:00:00'),
('review-007', 'rest-004', 'user-reg-011', 4, 'Música urbana genial', 'Me encanta la selección de música urbana. Perfecto para jóvenes.', 4, 4, 5, false, 2, '2024-01-12 16:00:00'),
('review-008', 'rest-005', 'user-reg-004', 5, 'Rock & Roll puro', 'El Rock & Roll Diner es genial. Hamburguesas deliciosas y rock clásico perfecto.', 5, 5, 5, false, 3, '2024-01-12 17:00:00'),
('review-009', 'rest-006', 'user-reg-006', 5, 'Electronic perfecto', 'Electronic Lounge tiene la mejor música electrónica. Ambiente futurista genial.', 5, 5, 5, false, 2, '2024-01-12 18:00:00'),
('review-010', 'rest-007', 'user-reg-005', 4, 'Salsa increíble', 'Salsa y Son tiene música latina perfecta. Ideal para bailar.', 5, 4, 4, false, 1, '2024-01-12 19:00:00'),
('review-011', 'rest-008', 'user-reg-007', 4, 'Indie perfecto para café', 'Indie Café tiene la mejor selección indie. Perfecto para trabajar o charlar.', 4, 4, 4, false, 2, '2024-01-12 20:00:00'),
('review-012', 'rest-009', 'user-reg-008', 5, 'Hip Hop Corner es lo máximo', 'El mejor lugar para hip hop en la ciudad. Ambiente urbano perfecto.', 5, 5, 5, false, 3, '2024-01-12 21:00:00'),
('review-013', 'rest-010', 'user-reg-009', 5, 'Clásica serenidad', 'Classical Bistro ofrece música clásica perfecta. Ambiente elegante y relajante.', 5, 5, 5, false, 2, '2024-01-12 22:00:00'),
('review-014', 'rest-010', 'user-reg-008', 4, 'Música clásica excelente', 'La selección de música clásica es impecable. Precios un poco altos pero vale la pena.', 5, 4, 4, false, 1, '2024-01-12 23:00:00'),
('review-015', 'rest-001', 'user-reg-015', 5, 'Experiencia inolvidable', 'Como admin, estoy impresionado con la calidad del servicio y la música.', 5, 5, 5, false, 1, '2024-01-13 00:00:00');

-- ==========================================
-- TOKENS DE AUTENTICACIÓN
-- ==========================================

INSERT INTO auth_tokens (id, user_id, user_type, token_hash, token_type, expires_at, ip_address, user_agent, created_at) VALUES
('token-001', 'user-reg-001', 'registered_user', '$2b$10$tokenhash1', 'access', '2024-01-16 18:35:00', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-15 18:35:00'),
('token-002', 'user-reg-002', 'registered_user', '$2b$10$tokenhash2', 'access', '2024-01-16 22:05:00', '192.168.1.111', 'Mozilla/5.0 (Android 14; Mobile)', '2024-01-15 22:05:00'),
('token-003', 'user-reg-003', 'registered_user', '$2b$10$tokenhash3', 'access', '2024-01-16 20:35:00', '192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2024-01-15 20:35:00'),
('token-004', 'user-reg-004', 'registered_user', '$2b$10$tokenhash4', 'access', '2024-01-16 19:05:00', '192.168.1.114', 'Mozilla/5.0 (Android 14; Mobile)', '2024-01-15 19:05:00'),
('token-005', 'user-reg-005', 'registered_user', '$2b$10$tokenhash5', 'access', '2024-01-16 18:50:00', '192.168.1.105', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-15 18:50:00'),
('token-006', 'rest-001', 'restaurant', '$2b$10$tokenhash6', 'access', '2024-01-16 18:30:00', '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2024-01-15 18:30:00'),
('token-007', 'rest-002', 'restaurant', '$2b$10$tokenhash7', 'access', '2024-01-16 18:45:00', '192.168.1.201', 'Mozilla/5.0 (macOS 14; Desktop)', '2024-01-15 18:45:00'),
('token-008', 'rest-003', 'restaurant', '$2b$10$tokenhash8', 'access', '2024-01-16 20:30:00', '192.168.1.202', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2024-01-15 20:30:00'),
('token-009', 'rest-004', 'restaurant', '$2b$10$tokenhash9', 'access', '2024-01-16 22:00:00', '192.168.1.203', 'Mozilla/5.0 (macOS 14; Desktop)', '2024-01-15 22:00:00'),
('token-010', 'rest-005', 'restaurant', '$2b$10$tokenhash10', 'access', '2024-01-16 19:00:00', '192.168.1.204', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2024-01-15 19:00:00');

-- ==========================================
-- LOGS DE ACTIVIDAD
-- ==========================================

INSERT INTO activity_logs (id, restaurant_id, user_id, action, entity_type, entity_id, details, ip_address, user_agent, created_at) VALUES
(1, 'rest-001', 'user-temp-001', 'song_requested', 'request', 'req-001', '{"song_title": "Bohemian Rhapsody", "artist": "Queen"}', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-15 18:35:00'),
(2, 'rest-001', 'user-temp-002', 'song_requested', 'request', 'req-002', '{"song_title": "Blinding Lights", "artist": "The Weeknd"}', '192.168.1.101', 'Mozilla/5.0 (Android 14; Mobile)', '2024-01-15 19:05:00'),
(3, 'rest-004', 'user-temp-012', 'song_requested', 'request', 'req-012', '{"song_title": "Dákiti", "artist": "Bad Bunny & Jhay Cortez"}', '192.168.1.111', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-15 22:05:00'),
(4, 'rest-003', 'user-temp-009', 'song_requested', 'request', 'req-009', '{"song_title": "What a Wonderful World", "artist": "Louis Armstrong"}', '192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2024-01-15 20:35:00'),
(5, 'rest-005', 'user-temp-015', 'song_requested', 'request', 'req-016', '{"song_title": "Stairway to Heaven", "artist": "Led Zeppelin"}', '192.168.1.114', 'Mozilla/5.0 (Android 14; Mobile)', '2024-01-15 19:05:00'),
(6, 'rest-001', NULL, 'song_favorited', 'favorite', 'fav-001', '{"song_title": "Bohemian Rhapsody", "favorite_type": "permanent"}', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-10 10:00:00'),
(7, 'rest-004', NULL, 'song_favorited', 'favorite', 'fav-003', '{"song_title": "Dákiti", "favorite_type": "permanent"}', '192.168.1.111', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-10 10:10:00'),
(8, 'rest-001', NULL, 'playlist_created', 'playlist', 'playlist-001', '{"playlist_name": "Mis Clásicos Favoritos", "is_public": true}', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-10 12:00:00'),
(9, 'rest-001', NULL, 'song_reviewed', 'review', 'review-001', '{"rating": 5, "title": "Excelente experiencia musical"}', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-12 10:00:00'),
(10, 'rest-004', NULL, 'song_reviewed', 'review', 'review-006', '{"rating": 5, "title": "¡La mejor fiesta!"}', '192.168.1.124', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '2024-01-12 15:00:00');

-- ==========================================
-- CONFIGURACIÓN FINAL
-- ==========================================

-- Actualizar estadísticas de restaurantes
UPDATE restaurants SET
  rating = COALESCE((
    SELECT AVG(rating)
    FROM restaurant_reviews
    WHERE restaurant_id = restaurants.id
  ), 0.00),
  total_reviews = COALESCE((
    SELECT COUNT(*)
    FROM restaurant_reviews
    WHERE restaurant_id = restaurants.id
  ), 0)
WHERE id IN ('rest-001', 'rest-002', 'rest-003', 'rest-004', 'rest-005', 'rest-006', 'rest-007', 'rest-008', 'rest-009', 'rest-010');

-- Actualizar estadísticas de canciones
UPDATE songs s
JOIN (
  SELECT song_id, COUNT(*) as request_count
  FROM requests
  GROUP BY song_id
) r ON s.id = r.song_id
SET s.times_requested = r.request_count;

-- Actualizar estadísticas de usuarios
UPDATE registered_users ru
JOIN (
  SELECT registered_user_id, COUNT(*) as request_count
  FROM listening_history
  GROUP BY registered_user_id
) lh ON ru.id = lh.registered_user_id
SET ru.total_requests = lh.request_count;

-- Actualizar estadísticas de playlists
UPDATE playlists p
SET p.song_count = (
  SELECT COUNT(*)
  FROM playlist_songs ps
  WHERE ps.playlist_id = p.id
),
p.play_count = COALESCE((
  SELECT SUM(f.play_count)
  FROM playlist_songs ps
  JOIN songs s ON ps.song_id = s.id
  LEFT JOIN favorites f ON f.song_id = s.id
  WHERE ps.playlist_id = p.id
), 0)
WHERE p.id IN (SELECT DISTINCT playlist_id FROM playlist_songs);

-- Reactivar foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- RESUMEN DE DATOS CREADOS
-- ==========================================
/*
BASE DE DATOS COMPLETA CREADA CON ÉXITO

ESTADÍSTICAS:
- 10 Restaurantes únicos con diferentes características
- 15 Usuarios registrados con preferencias variadas
- 25 Usuarios temporales (mesas) activos
- 100 Canciones de 10 géneros diferentes
- 30 Peticiones de canciones activas
- 30 Favoritos (permanentes y de sesión)
- 10 Playlists colaborativas y privadas
- 30 Entradas de historial de reproducción
- 15 Reviews de restaurantes
- 10 Tokens de autenticación activos
- 10 Logs de actividad del sistema

GÉNEROS MUSICALES REPRESENTADOS:
- Rock, Pop, Jazz, Reggaeton, Electronic
- Salsa, Indie, Hip-Hop, Classical, Latin
- Metal, Blues, Soul, Disco, Funk

CIUDADES:
- Bogotá, Medellín, Cali, Barranquilla, Cartagena

TIPOS DE SUSCRIPCIÓN:
- Starter, Professional, Enterprise

ESTADO DEL SISTEMA:
- ✅ Base de datos completamente poblada
- ✅ Relaciones consistentes entre tablas
- ✅ Datos realistas para testing
- ✅ Sistema listo para pruebas completas
*/

-- ===============================
-- VISTAS ÚTILES
-- ===============================

-- Vista de restaurantes con información de suscripción
CREATE OR REPLACE VIEW restaurant_subscription_view AS
SELECT
  r.*,
  sp.name as subscription_plan_name,
  sp.price as subscription_price,
  sp.period as subscription_period,
  sp.features as subscription_features,
  sp.max_requests as subscription_max_requests,
  sp.max_tables as subscription_max_tables,
  sp.has_spotify as subscription_has_spotify,
  CASE
    WHEN r.subscription_status = 'active' THEN 'Activo'
    WHEN r.subscription_status = 'pending' THEN 'Pendiente de aprobación'
    WHEN r.subscription_status = 'inactive' THEN 'Inactivo'
    WHEN r.subscription_status = 'cancelled' THEN 'Cancelado'
    ELSE 'Sin suscripción'
  END as subscription_status_label
FROM restaurants r
LEFT JOIN subscription_plans sp ON r.subscription_plan_id = sp.id;

-- Vista de estadísticas de suscripciones
CREATE OR REPLACE VIEW subscription_stats_view AS
SELECT
  sp.id as plan_id,
  sp.name as plan_name,
  sp.price,
  sp.period,
  COUNT(r.id) as total_restaurants,
  COUNT(CASE WHEN r.subscription_status = 'active' THEN 1 END) as active_restaurants,
  COUNT(CASE WHEN r.subscription_status = 'pending' THEN 1 END) as pending_restaurants,
  SUM(CASE WHEN r.subscription_status = 'active' THEN sp.price ELSE 0 END) as monthly_revenue
FROM subscription_plans sp
LEFT JOIN restaurants r ON sp.id = r.subscription_plan_id
GROUP BY sp.id, sp.name, sp.price, sp.period
ORDER BY sp.price ASC;

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

-- ===============================
-- PROCEDIMIENTOS
-- ===============================

DELIMITER //

-- Procedimiento para obtener perfil de usuario (actualizado con suscripciones)
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

-- Procedimiento para obtener perfil de restaurante con suscripción
CREATE PROCEDURE GetRestaurantProfile(IN restaurant_id VARCHAR(36))
BEGIN
  SELECT
    r.*,
    sp.name as subscription_plan_name,
    sp.price as subscription_price,
    sp.period as subscription_period,
    sp.features as subscription_features,
    sp.max_requests as subscription_max_requests,
    sp.max_tables as subscription_max_tables,
    sp.has_spotify as subscription_has_spotify,
    CASE
      WHEN r.subscription_status = 'active' THEN 'Activo'
      WHEN r.subscription_status = 'pending' THEN 'Pendiente de aprobación'
      WHEN r.subscription_status = 'inactive' THEN 'Inactivo'
      WHEN r.subscription_status = 'cancelled' THEN 'Cancelado'
      ELSE 'Sin suscripción'
    END as subscription_status_label
  FROM restaurants r
  LEFT JOIN subscription_plans sp ON r.subscription_plan_id = sp.id
  WHERE r.id = restaurant_id;
END//

-- Procedimiento para actualizar plan de suscripción de restaurante
CREATE PROCEDURE UpdateRestaurantSubscription(
  IN p_restaurant_id VARCHAR(36),
  IN p_plan_id VARCHAR(50),
  IN p_payment_proof VARCHAR(500)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- Verificar que el restaurante existe
  IF NOT EXISTS (SELECT 1 FROM restaurants WHERE id = p_restaurant_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Restaurante no encontrado';
  END IF;

  -- Verificar que el plan existe
  IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id = p_plan_id AND is_active = 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Plan de suscripción no válido';
  END IF;

  -- Actualizar suscripción
  UPDATE restaurants SET
    subscription_plan_id = p_plan_id,
    subscription_status = 'pending',
    subscription_start_date = NOW(),
    subscription_payment_proof = p_payment_proof,
    updated_at = NOW()
  WHERE id = p_restaurant_id;

  -- Log de actividad
  INSERT INTO activity_logs (restaurant_id, action, entity_type, entity_id, details)
  VALUES (p_restaurant_id, 'subscription_updated', 'restaurant', p_restaurant_id,
    JSON_OBJECT('plan_id', p_plan_id, 'payment_proof', p_payment_proof));

  COMMIT;

  -- Retornar información actualizada
  CALL GetRestaurantProfile(p_restaurant_id);
END//

-- Procedimiento para aprobar suscripción de restaurante
CREATE PROCEDURE ApproveRestaurantSubscription(IN p_restaurant_id VARCHAR(36))
BEGIN
  DECLARE v_plan_id VARCHAR(50);

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- Obtener plan actual
  SELECT subscription_plan_id INTO v_plan_id
  FROM restaurants
  WHERE id = p_restaurant_id;

  -- Verificar que el restaurante existe
  IF v_plan_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Restaurante no tiene plan de suscripción';
  END IF;

  -- Actualizar estado de suscripción
  UPDATE restaurants SET
    subscription_status = 'active',
    subscription_start_date = NOW(),
    subscription_end_date = DATE_ADD(NOW(), INTERVAL 1 MONTH),
    pending_approval = false,
    updated_at = NOW()
  WHERE id = p_restaurant_id;

  -- Log de actividad
  INSERT INTO activity_logs (restaurant_id, action, entity_type, entity_id, details)
  VALUES (p_restaurant_id, 'subscription_approved', 'restaurant', p_restaurant_id,
    JSON_OBJECT('plan_id', v_plan_id));

  COMMIT;

  -- Retornar información actualizada
  CALL GetRestaurantProfile(p_restaurant_id);
END//

DELIMITER ;
