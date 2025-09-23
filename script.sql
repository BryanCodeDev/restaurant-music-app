-- ============================
-- CREACIÓN DE BASE DE DATOS
-- ============================
DROP DATABASE IF EXISTS restaurant_music_db;
CREATE DATABASE restaurant_music_db;
USE restaurant_music_db;

-- ============================
-- TABLAS PRINCIPALES
-- ============================

-- Planes de suscripción
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
  timezone VARCHAR(50) DEFAULT 'America/Bogota',
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

-- ===============================
-- INSERTAR DATOS DE PRUEBA
-- ===============================

-- Insertar planes de suscripción
INSERT INTO subscription_plans (id, name, price, period, description, features, limitations, color, popular, max_requests, max_tables, has_spotify) VALUES
('starter', 'Starter', 80000.00, 'mes', 'Perfecto para comenzar', JSON_ARRAY('Hasta 50 mesas', 'Cola musical básica', '1,000 peticiones/mes', 'Soporte por email', 'Estadísticas básicas'), JSON_ARRAY('Sin personalización avanzada', 'Sin API access'), 'blue', false, 1000, 50, false),
('professional', 'Professional', 120000.00, 'mes', 'Ideal para restaurantes establecidos', JSON_ARRAY('Mesas ilimitadas', 'Cola musical avanzada', '10,000 peticiones/mes', 'Soporte prioritario 24/7', 'Analytics completos', 'Personalización completa', 'Integración con Spotify', 'Control de contenido'), JSON_ARRAY(), 'amber', true, 10000, null, true),
('enterprise', 'Enterprise', 300000.00, 'mes', 'Para cadenas y grandes establecimientos', JSON_ARRAY('Todo lo de Professional', 'Múltiples ubicaciones', 'Peticiones ilimitadas', 'Soporte dedicado', 'API completa', 'White-label', 'Integración personalizada', 'SLA garantizado'), JSON_ARRAY(), 'purple', false, null, null, true);

-- Restaurante de prueba
-- Nota: En producción, hashea las contraseñas con bcrypt antes de insertar
INSERT INTO restaurants (id, name, slug, email, password, city, country, verification_token, pending_approval, subscription_plan_id, subscription_status) VALUES
('rest-001', 'La Terraza Musical', 'la-terraza-musical', 'admin@laterraza.com', 'admin123', 'Bogotá', 'Colombia', NULL, false, 'professional', 'active');

-- Usuarios registrados
INSERT INTO registered_users (id, name, email, password, phone, preferred_genres, is_active, verification_token, role) VALUES
('reg-user-001', 'María González', 'maria@demo.com', 'demo123', '+57 300 123 4567', '["pop", "rock", "ballad"]', true, NULL, 'user'),
('reg-user-002', 'Carlos Rodríguez', 'carlos@demo.com', 'demo123', '+57 300 765 4321', '["electronic", "hip-hop", "reggaeton"]', true, NULL, 'user'),
('reg-user-003', 'Ana Martínez', 'ana@demo.com', 'demo123', '+57 300 555 0123', '["jazz", "classical", "ballad"]', true, NULL, 'user'),
('reg-user-004', 'Super Admin', 'super@admin.com', '$2a$12$dUdVyxQvHAK6p4U05I8DA.YtXxe7LOnyPTAWv22.37kkwyE6B33y2', NULL, NULL, true, NULL, 'superadmin');

-- Usuarios temporales (mesas)
INSERT INTO users (id, restaurant_id, table_number, session_id, name, user_type) VALUES
('user-001', 'rest-001', 'Mesa #5', 'session-001', 'Cliente Mesa 5', 'guest'),
('user-002', 'rest-001', 'Mesa #12', 'session-002', 'Cliente Mesa 12', 'guest');

-- Canciones de ejemplo
INSERT INTO songs (id, restaurant_id, title, artist, album, duration, genre, year) VALUES
('song-001', 'rest-001', 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', '5:55', 'rock', 1975),
('song-002', 'rest-001', 'Blinding Lights', 'The Weeknd', 'After Hours', '3:20', 'pop', 2019);

-- Favoritos de prueba
INSERT INTO favorites (id, registered_user_id, song_id, restaurant_id, favorite_type, notes) VALUES
('fav-001', 'reg-user-001', 'song-001', 'rest-001', 'permanent', 'Clásico favorito'),
('fav-002', 'reg-user-002', 'song-002', 'rest-001', 'permanent', 'Me sube el ánimo');

-- Playlists
INSERT INTO playlists (id, registered_user_id, name, description, is_public) VALUES
('playlist-001', 'reg-user-001', 'Mis Clásicos', 'Las mejores canciones clásicas', true);

INSERT INTO playlist_songs (id, playlist_id, song_id, position, added_by) VALUES
('ps-001', 'playlist-001', 'song-001', 1, 'reg-user-001');

-- Reviews
INSERT INTO restaurant_reviews (id, restaurant_id, registered_user_id, rating, title, comment, music_quality_rating, service_rating, ambiance_rating) VALUES
('review-001', 'rest-001', 'reg-user-001', 5, 'Excelente experiencia musical', 'Gran ambiente y música', 5, 5, 5);

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

-- Procedimiento para obtener perfil de usuario
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
