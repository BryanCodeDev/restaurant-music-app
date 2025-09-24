import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { Music, Clock, Calendar, Building } from 'lucide-react';

const ListeningHistory = ({ userId, restaurantSlug }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('7d'); // 7d, 30d, all

  useEffect(() => {
    if (userId) {
      loadHistory();
    }
  }, [userId, filterDate]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const fromDate = filterDate === 'all' ? null : new Date(Date.now() - (parseInt(filterDate) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      const response = await apiService.getListeningHistory(userId, 50, fromDate);
      if (response && response.history) {
        setHistory(response.history);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading eliminado - mostrar directamente el contenido

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Historial de Reproducción</h1>
        <select 
          value={filterDate} 
          onChange={(e) => setFilterDate(e.target.value)} 
          className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="all">Todo el historial</option>
        </select>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16">
          <Music className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No hay historial</h3>
          <p className="text-slate-500">No se ha reproducido ninguna canción aún en este período.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={item.id} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-start space-x-4">
                <img 
                  src={item.song?.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop'} 
                  alt={item.song?.title} 
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight truncate">
                        {item.song?.title || 'Canción desconocida'}
                      </h3>
                      <p className="text-slate-300 truncate">{item.song?.artist || 'Artista desconocido'}</p>
                      <p className="text-sm text-slate-400">
                        {item.song?.album ? `${item.song.album} • ${item.song.year}` : item.song?.year}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{formatDateTime(item.played_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{item.restaurant_name || 'Restaurante desconocido'}</span>
                    </div>
                    {item.play_duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(item.play_duration / 60)}:{(item.play_duration % 60).toString().padStart(2, '0')} reproducida</span>
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.was_completed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {item.was_completed ? 'Completada' : 'Parcial'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-slate-500 text-sm">
        Se han cargado {history.length} elementos del historial.
      </div>
    </div>
  );
};

export default ListeningHistory;