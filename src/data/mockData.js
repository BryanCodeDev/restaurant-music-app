import { 
  Music, 
  Sparkles, 
  Headphones, 
  Heart, 
  Disc3, 
  Mic, 
  Music2, 
  Radio,
  Zap,
  Volume2,
  Waves,
  Music4,
  Music3,
  FileAudio
} from 'lucide-react';

// Géneros musicales con iconos de Lucide React
export const genres = [
  { 
    id: 'all', 
    name: 'Todos', 
    icon: Music2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  { 
    id: 'rock', 
    name: 'Rock', 
    icon: Music,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20'
  },
  { 
    id: 'pop', 
    name: 'Pop', 
    icon: Sparkles,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20'
  },
  { 
    id: 'electronic', 
    name: 'Electrónica', 
    icon: Zap,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20'
  },
  { 
    id: 'hip-hop', 
    name: 'Hip Hop', 
    icon: Mic,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
  { 
    id: 'jazz', 
    name: 'Jazz', 
    icon: Music4,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
  { 
    id: 'reggaeton', 
    name: 'Reggaetón', 
    icon: Volume2,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  { 
    id: 'salsa', 
    name: 'Salsa', 
    icon: Waves,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20'
  },
  { 
    id: 'ballad', 
    name: 'Baladas', 
    icon: Heart,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20'
  },
  { 
    id: 'classical', 
    name: 'Clásica', 
    icon: FileAudio,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  { 
    id: 'reggae', 
    name: 'Reggae', 
    icon: Radio,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20'
  },
  { 
    id: 'funk', 
    name: 'Funk', 
    icon: Music3,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20'
  }
];

// Datos de canciones de ejemplo
export const mockSongs = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    genre: "rock",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    year: 1975,
    popularity: 95,
    energy: 85
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    genre: "pop",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    year: 2019,
    popularity: 98,
    energy: 78
  },
  {
    id: 3,
    title: "One More Time",
    artist: "Daft Punk",
    album: "Discovery",
    duration: "5:20",
    genre: "electronic",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    year: 2000,
    popularity: 89,
    energy: 92
  },
  {
    id: 4,
    title: "HUMBLE.",
    artist: "Kendrick Lamar",
    album: "DAMN.",
    duration: "2:57",
    genre: "hip-hop",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    year: 2017,
    popularity: 91,
    energy: 76
  },
  {
    id: 5,
    title: "Take Five",
    artist: "Dave Brubeck",
    album: "Time Out",
    duration: "5:24",
    genre: "jazz",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    year: 1959,
    popularity: 82,
    energy: 45
  },
  {
    id: 6,
    title: "Con Altura",
    artist: "Rosalía ft. J Balvin",
    album: "Single",
    duration: "2:39",
    genre: "reggaeton",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    year: 2019,
    popularity: 87,
    energy: 88
  },
  {
    id: 7,
    title: "El Cuarto de Tula",
    artist: "Buena Vista Social Club",
    album: "Buena Vista Social Club",
    duration: "7:12",
    genre: "salsa",
    image: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop",
    year: 1997,
    popularity: 79,
    energy: 85
  },
  {
    id: 8,
    title: "My Heart Will Go On",
    artist: "Celine Dion",
    album: "Titanic Soundtrack",
    duration: "4:40",
    genre: "ballad",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    year: 1997,
    popularity: 93,
    energy: 32
  },
  {
    id: 9,
    title: "Eine kleine Nachtmusik",
    artist: "Wolfgang Amadeus Mozart",
    album: "Classical Collection",
    duration: "6:30",
    genre: "classical",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    year: 1787,
    popularity: 75,
    energy: 55
  },
  {
    id: 10,
    title: "No Woman No Cry",
    artist: "Bob Marley",
    album: "Live!",
    duration: "7:08",
    genre: "reggae",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    year: 1975,
    popularity: 88,
    energy: 68
  },
  {
    id: 11,
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    album: "Uptown Special",
    duration: "4:30",
    genre: "funk",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop",
    year: 2014,
    popularity: 96,
    energy: 89
  },
  {
    id: 12,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:53",
    genre: "pop",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    year: 2017,
    popularity: 97,
    energy: 65
  },
  {
    id: 13,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: "8:02",
    genre: "rock",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    year: 1971,
    popularity: 94,
    energy: 72
  },
  {
    id: 14,
    title: "Levels",
    artist: "Avicii",
    album: "True",
    duration: "3:18",
    genre: "electronic",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    year: 2011,
    popularity: 90,
    energy: 95
  },
  {
    id: 15,
    title: "Sicko Mode",
    artist: "Travis Scott",
    album: "Astroworld",
    duration: "5:12",
    genre: "hip-hop",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    year: 2018,
    popularity: 85,
    energy: 81
  },
  {
    id: 16,
    title: "La Vida Es Un Carnaval",
    artist: "Celia Cruz",
    album: "Mi Vida es Cantar",
    duration: "4:15",
    genre: "salsa",
    image: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop",
    year: 1998,
    popularity: 84,
    energy: 87
  },
  {
    id: 17,
    title: "Someone Like You",
    artist: "Adele",
    album: "21",
    duration: "4:45",
    genre: "ballad",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    year: 2011,
    popularity: 92,
    energy: 28
  },
  {
    id: 18,
    title: "Clair de Lune",
    artist: "Claude Debussy",
    album: "Suite Bergamasque",
    duration: "5:03",
    genre: "classical",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    year: 1905,
    popularity: 73,
    energy: 25
  },
  {
    id: 19,
    title: "Three Little Birds",
    artist: "Bob Marley & The Wailers",
    album: "Exodus",
    duration: "3:00",
    genre: "reggae",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    year: 1977,
    popularity: 86,
    energy: 62
  },
  {
    id: 20,
    title: "Give Up The Funk",
    artist: "Parliament",
    album: "Mothership Connection",
    duration: "5:50",
    genre: "funk",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop",
    year: 1975,
    popularity: 77,
    energy: 83
  },
  {
    id: 21,
    title: "Perfect",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "4:23",
    genre: "ballad",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    year: 2017,
    popularity: 95,
    energy: 35
  },
  {
    id: 22,
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep, Where Do We Go?",
    duration: "3:14",
    genre: "pop",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    year: 2019,
    popularity: 94,
    energy: 73
  },
  {
    id: 23,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    duration: "3:01",
    genre: "ballad",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    year: 1971,
    popularity: 96,
    energy: 40
  },
  {
    id: 24,
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    duration: "4:54",
    genre: "pop",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    year: 1983,
    popularity: 98,
    energy: 82
  },
  {
    id: 25,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    genre: "rock",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    year: 1976,
    popularity: 97,
    energy: 75
  }
];

// Función para filtrar canciones
export const filterSongs = (songs, genreId, searchTerm) => {
  let filtered = songs;

  // Filtrar por género
  if (genreId && genreId !== 'all') {
    filtered = filtered.filter(song => song.genre === genreId);
  }

  // Filtrar por término de búsqueda
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(song => 
      song.title.toLowerCase().includes(term) ||
      song.artist.toLowerCase().includes(term) ||
      song.album.toLowerCase().includes(term) ||
      song.genre.toLowerCase().includes(term)
    );
  }

  return filtered;
};

// Función para obtener canciones populares
export const getPopularSongs = (songs, limit = 6) => {
  return songs
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

// Función para obtener canciones por género
export const getSongsByGenre = (songs, genreId, limit = 4) => {
  return songs
    .filter(song => song.genre === genreId)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};

// Función para obtener estadísticas
export const getMusicStats = (songs, requests = []) => {
  const totalSongs = songs.length;
  const totalGenres = new Set(songs.map(song => song.genre)).size;
  const averageDuration = songs.reduce((acc, song) => {
    const [minutes, seconds] = song.duration.split(':').map(Number);
    return acc + (minutes * 60 + seconds);
  }, 0) / songs.length / 60;

  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const playingRequests = requests.filter(req => req.status === 'playing').length;

  return {
    totalSongs,
    totalGenres,
    averageDuration: Math.round(averageDuration),
    pendingRequests,
    playingRequests,
    totalRequests: requests.length
  };
};

// Función para obtener canciones recomendadas basadas en favoritos
export const getRecommendedSongs = (songs, favorites, limit = 6) => {
  if (!favorites.length) {
    return getPopularSongs(songs, limit);
  }

  // Obtener géneros de favoritos
  const favoriteGenres = [...new Set(favorites.map(fav => fav.genre))];
  
  // Filtrar canciones por géneros favoritos, excluyendo las que ya están en favoritos
  const recommended = songs
    .filter(song => 
      favoriteGenres.includes(song.genre) && 
      !favorites.some(fav => fav.id === song.id)
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

  // Si no hay suficientes recomendaciones, completar con canciones populares
  if (recommended.length < limit) {
    const remaining = getPopularSongs(songs, limit - recommended.length)
      .filter(song => !recommended.some(rec => rec.id === song.id));
    recommended.push(...remaining);
  }

  return recommended.slice(0, limit);
};