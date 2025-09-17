import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { Star, User, Calendar, MessageSquare, Send, AlertCircle } from 'lucide-react';

const RestaurantReviews = ({ restaurantSlug }) => {
  const slug = restaurantSlug;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    musicRating: 5,
    serviceRating: 5,
    ambianceRating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userId] = useState(localStorage.getItem('registered_user_id') || null);
  const [userName] = useState(localStorage.getItem('user_name') || 'Usuario');

  useEffect(() => {
    if (slug) {
      loadReviews();
    }
  }, [slug]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getRestaurantReviews(slug, 10, 0);
      if (response && response.reviews) {
        setReviews(response.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Debes iniciar sesión para dejar una reseña');
      return;
    }
    if (newReview.comment.trim().length < 10) {
      setError('La reseña debe tener al menos 10 caracteres');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await apiService.createReview(slug, newReview.rating, newReview.title, newReview.comment, newReview.musicRating, newReview.serviceRating, newReview.ambianceRating);
      if (response && response.review) {
        setReviews(prev => [response.review, ...prev]);
        setNewReview({ rating: 5, title: '', comment: '', musicRating: 5, serviceRating: 5, ambianceRating: 5 });
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error al enviar la reseña: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onChange, name, max = 5 }) => (
    <div className="flex space-x-1">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            size={24}
            className={`cursor-pointer transition-colors ${
              starValue <= (onChange ? rating : rating || 0) ? 'text-yellow-400 fill-current' : 'text-slate-500'
            } ${onChange ? 'hover:text-yellow-300' : ''}`}
            onClick={() => onChange && onChange(starValue)}
          />
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-slate-400">Cargando reseñas...</span>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reseñas del Restaurante</h1>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex">
            <StarRating rating={parseFloat(averageRating)} />
          </div>
          <span className="text-xl font-semibold text-slate-300">{averageRating}</span>
          <span className="text-slate-400">({reviews.length} reseñas)</span>
        </div>
      </div>

      {/* New Review Form */}
      {userId && (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Deja tu reseña</span>
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Calificación general</label>
              <StarRating rating={newReview.rating} onChange={(val) => setNewReview({...newReview, rating: val})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-slate-300 text-sm mb-1">Música</label>
                <StarRating rating={newReview.musicRating} onChange={(val) => setNewReview({...newReview, musicRating: val})} max={5} />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Servicio</label>
                <StarRating rating={newReview.serviceRating} onChange={(val) => setNewReview({...newReview, serviceRating: val})} max={5} />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Ambiente</label>
                <StarRating rating={newReview.ambianceRating} onChange={(val) => setNewReview({...newReview, ambianceRating: val})} max={5} />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Título de la reseña</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                placeholder="Ej: ¡Increíble experiencia musical!"
                maxLength={100}
                className="w-full bg-slate-700 p-3 rounded-lg text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Comentario</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Cuéntanos sobre tu experiencia..."
                rows={4}
                minLength={10}
                className="w-full bg-slate-700 p-3 rounded-lg text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-slate-500 mt-1">{newReview.comment.length}/500</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Publicar Reseña</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/50 rounded-xl">
          <Star className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No hay reseñas aún</h3>
          <p className="text-slate-500">Sé el primero en dejar tu opinión sobre este restaurante.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg">{review.title || 'Reseña sin título'}</h3>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} />
                        <span className="text-slate-300 font-medium">{review.rating}/5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">{review.user_name || 'Usuario anónimo'}</div>
                      <div className="text-xs text-slate-500 flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(review.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  {review.music_quality_rating && (
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <Star className={`h-4 w-4 ${review.music_quality_rating >= 1 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.music_quality_rating >= 2 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.music_quality_rating >= 3 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.music_quality_rating >= 4 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.music_quality_rating >= 5 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                        </div>
                        <span className="text-slate-300">Música</span>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <Star className={`h-4 w-4 ${review.service_rating >= 1 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.service_rating >= 2 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.service_rating >= 3 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.service_rating >= 4 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.service_rating >= 5 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                        </div>
                        <span className="text-slate-300">Servicio</span>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <Star className={`h-4 w-4 ${review.ambiance_rating >= 1 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.ambiance_rating >= 2 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.ambiance_rating >= 3 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.ambiance_rating >= 4 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                          <Star className={`h-4 w-4 ${review.ambiance_rating >= 5 ? 'text-yellow-400 fill-current' : 'text-slate-500'}`} />
                        </div>
                        <span className="text-slate-300">Ambiente</span>
                      </div>
                    </div>
                  )}
                  <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!userId && (
        <div className="text-center py-8 bg-slate-800/50 rounded-xl">
          <User className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Inicia sesión para reseñar</h3>
          <p className="text-slate-500 mb-4">Regístrate o inicia sesión para compartir tu experiencia.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Iniciar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;