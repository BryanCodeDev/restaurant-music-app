import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { Plus, Trash2, Edit, Music } from 'lucide-react';

const PlaylistManager = ({ userId, restaurantSlug }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (userId) {
      loadPlaylists();
    }
  }, [userId]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserPlaylists(userId);
      if (response && response.playlists) {
        setPlaylists(response.playlists);
      }
    } catch (err) {
      console.error('Error loading playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const response = await apiService.createPlaylist(userId, newPlaylistName);
      if (response && response.playlist) {
        setPlaylists(prev => [...prev, response.playlist]);
        setNewPlaylistName('');
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      // Implementar delete si backend lo soporta
      // await apiService.deletePlaylist(playlistId);
      loadPlaylists();
    } catch (err) {
      console.error('Error deleting playlist:', err);
    }
  };

  const editPlaylist = async (playlistId) => {
    if (!editName.trim()) return;
    try {
      // Implementar update si backend lo soporta
      // await apiService.updatePlaylist(playlistId, { name: editName });
      loadPlaylists();
      setEditingId(null);
      setEditName('');
    } catch (err) {
      console.error('Error editing playlist:', err);
    }
  };

  const loadPlaylistSongs = async (playlistId) => {
    try {
      const response = await apiService.getPlaylistSongs(playlistId);
      if (response && response.songs) {
        setSongs(response.songs);
        setSelectedPlaylist(playlistId);
      }
    } catch (err) {
      console.error('Error loading playlist songs:', err);
    }
  };

  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      await apiService.addSongToPlaylist(playlistId, songId);
      loadPlaylistSongs(playlistId);
    } catch (err) {
      console.error('Error adding song to playlist:', err);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Cargando playlists...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mis Playlists</h2>
      
      {/* Create New Playlist */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Nombre de nueva playlist"
          className="bg-slate-700 text-white p-2 rounded mr-2 flex-1"
        />
        <button onClick={createPlaylist} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
          Crear
        </button>
      </div>

      {/* Playlists List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {playlists.map(playlist => (
          <div key={playlist.id} className="bg-slate-700 p-4 rounded-lg">
            {editingId === playlist.id ? (
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-600 p-2 rounded mb-2 text-white"
                />
                <div className="flex space-x-2">
                  <button onClick={() => editPlaylist(playlist.id)} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded transition-colors flex-1">
                    Guardar
                  </button>
                  <button onClick={() => { setEditingId(null); setEditName(''); }} className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded transition-colors flex-1">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold mb-2">{playlist.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{playlist.description || 'Sin descripción'}</p>
                <div className="flex space-x-2">
                  <button onClick={() => loadPlaylistSongs(playlist.id)} className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-sm transition-colors flex-1">
                    Ver Canciones
                  </button>
                  <button onClick={() => { setEditingId(playlist.id); setEditName(playlist.name); }} className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => deletePlaylist(playlist.id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Playlist Songs */}
      {selectedPlaylist && (
        <div>
          <h3 className="text-xl font-bold mb-4">Canciones en Playlist</h3>
          <div className="space-y-2">
            {songs.length > 0 ? (
              songs.map(song => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-slate-800 rounded">
                  <div className="flex items-center space-x-3">
                    <Music size={20} className="text-purple-400" />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-slate-400">{song.artist}</p>
                    </div>
                  </div>
                  <button onClick={() => addSongToPlaylist(selectedPlaylist, song.id)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors">
                    Agregar
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-slate-400">No hay canciones en esta playlist.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;