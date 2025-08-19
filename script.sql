-- Setup completo para Restaurant Music App
-- Ejecutar en MySQL Workbench paso a paso

-- 1. Crear base de datos
CREATE DATABASE restaurant_music_db;
USE restaurant_music_db;

-- 2. Crear tablas (usar el schema anterior)
CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  timezone VARCHAR(50) DEFAULT 'America/Bogota',
  max_requests_per_user INT DEFAULT 2,
  queue_limit INT DEFAULT 50,
  auto_play BOOLEAN DEFAULT true,
  allow_explicit BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  subscription_plan ENUM('free', 'premium', 'enterprise') DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  restaurant_id VARCHAR(36) NOT NULL,
  table_number VARCHAR(20) NOT NULL,
  session_id VARCHAR(255),
  name VARCHAR(100),
  total_requests INT DEFAULT 0,
  requests_today INT DEFAULT 0,
  last_request_at TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

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
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE requests (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  restaurant_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  song_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'playing', 'completed', 'cancelled') DEFAULT 'pending',
  queue_position INT DEFAULT 0,
  user_table VARCHAR(20) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_playing_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  song_id VARCHAR(36) NOT NULL,
  restaurant_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_song (user_id, song_id)
);

-- 3. Insertar restaurante de prueba
INSERT INTO restaurants (id, name, slug, email, city, country) VALUES 
('rest-001', 'La Terraza Musical', 'la-terraza-musical', 'admin@laterraza.com', 'Bogotá', 'Colombia');

-- 4. Insertar canciones (basadas en tu mockData.js)
INSERT INTO songs (id, restaurant_id, title, artist, album, duration, genre, image, year, popularity, energy) VALUES
('song-001', 'rest-001', 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', '5:55', 'rock', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 1975, 95, 85),
('song-002', 'rest-001', 'Blinding Lights', 'The Weeknd', 'After Hours', '3:20', 'pop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 2019, 98, 78),
('song-003', 'rest-001', 'One More Time', 'Daft Punk', 'Discovery', '5:20', 'electronic', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 2000, 89, 92),
('song-004', 'rest-001', 'HUMBLE.', 'Kendrick Lamar', 'DAMN.', '2:57', 'hip-hop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 2017, 91, 76),
('song-005', 'rest-001', 'Take Five', 'Dave Brubeck', 'Time Out', '5:24', 'jazz', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 1959, 82, 45),
('song-006', 'rest-001', 'Con Altura', 'Rosalía ft. J Balvin', 'Single', '2:39', 'reggaeton', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 2019, 87, 88),
('song-007', 'rest-001', 'El Cuarto de Tula', 'Buena Vista Social Club', 'Buena Vista Social Club', '7:12', 'salsa', 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop', 1997, 79, 85),
('song-008', 'rest-001', 'My Heart Will Go On', 'Celine Dion', 'Titanic Soundtrack', '4:40', 'ballad', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 1997, 93, 32),
('song-009', 'rest-001', 'Eine kleine Nachtmusik', 'Wolfgang Amadeus Mozart', 'Classical Collection', '6:30', 'classical', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop', 1787, 75, 55),
('song-010', 'rest-001', 'No Woman No Cry', 'Bob Marley', 'Live!', '7:08', 'reggae', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 1975, 88, 68),
('song-011', 'rest-001', 'Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'Uptown Special', '4:30', 'funk', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop', 2014, 96, 89),
('song-012', 'rest-001', 'Shape of You', 'Ed Sheeran', '÷ (Divide)', '3:53', 'pop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 2017, 97, 65),
('song-013', 'rest-001', 'Stairway to Heaven', 'Led Zeppelin', 'Led Zeppelin IV', '8:02', 'rock', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 1971, 94, 72),
('song-014', 'rest-001', 'Levels', 'Avicii', 'True', '3:18', 'electronic', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 2011, 90, 95),
('song-015', 'rest-001', 'Sicko Mode', 'Travis Scott', 'Astroworld', '5:12', 'hip-hop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 2018, 85, 81),
('song-016', 'rest-001', 'La Vida Es Un Carnaval', 'Celia Cruz', 'Mi Vida es Cantar', '4:15', 'salsa', 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop', 1998, 84, 87),
('song-017', 'rest-001', 'Someone Like You', 'Adele', '21', '4:45', 'ballad', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 2011, 92, 28),
('song-018', 'rest-001', 'Clair de Lune', 'Claude Debussy', 'Suite Bergamasque', '5:03', 'classical', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop', 1905, 73, 25),
('song-019', 'rest-001', 'Three Little Birds', 'Bob Marley & The Wailers', 'Exodus', '3:00', 'reggae', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 1977, 86, 62),
('song-020', 'rest-001', 'Give Up The Funk', 'Parliament', 'Mothership Connection', '5:50', 'funk', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop', 1975, 77, 83),
('song-021', 'rest-001', 'Perfect', 'Ed Sheeran', '÷ (Divide)', '4:23', 'ballad', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 2017, 95, 35),
('song-022', 'rest-001', 'Bad Guy', 'Billie Eilish', 'When We All Fall Asleep, Where Do We Go?', '3:14', 'pop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 2019, 94, 73),
('song-023', 'rest-001', 'Imagine', 'John Lennon', 'Imagine', '3:01', 'ballad', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 1971, 96, 40),
('song-024', 'rest-001', 'Billie Jean', 'Michael Jackson', 'Thriller', '4:54', 'pop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 1983, 98, 82),
('song-025', 'rest-001', 'Hotel California', 'Eagles', 'Hotel California', '6:30', 'rock', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 1976, 97, 75);

-- 5. Crear algunos usuarios de prueba
INSERT INTO users (id, restaurant_id, table_number, session_id, name) VALUES
('user-001', 'rest-001', 'Mesa #5', 'session-001', 'Cliente Mesa 5'),
('user-002', 'rest-001', 'Mesa #12', 'session-002', 'Cliente Mesa 12'),
('user-003', 'rest-001', 'Mesa #8', 'session-003', 'Cliente Mesa 8');

-- 6. Crear algunas peticiones de prueba
INSERT INTO requests (id, restaurant_id, user_id, song_id, status, user_table, queue_position) VALUES
('req-001', 'rest-001', 'user-001', 'song-025', 'pending', 'Mesa #5', 1),
('req-002', 'rest-001', 'user-002', 'song-024', 'playing', 'Mesa #12', 0),
('req-003', 'rest-001', 'user-003', 'song-012', 'completed', 'Mesa #8', 0);

-- Verificar que todo se creó correctamente
SELECT 'Restaurantes' as tabla, COUNT(*) as registros FROM restaurants
UNION ALL
SELECT 'Canciones' as tabla, COUNT(*) as registros FROM songs
UNION ALL
SELECT 'Usuarios' as tabla, COUNT(*) as registros FROM users  
UNION ALL
SELECT 'Peticiones' as tabla, COUNT(*) as registros FROM requests;