// filepath: f:\React\front-johny-motorbike\johny-motorbike\src\components\RouteComments.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/**
 * Función para verificar si la API está disponible
 * @param {string} apiUrl - URL base de la API
 * @returns {Promise<boolean>} - true si la API está disponible, false en caso contrario
 */
const checkApiAvailability = async (apiUrl) => {
  try {
    
    // Intentar hacer una solicitud simple al servidor con un endpoint más ligero
    const response = await fetch(`${apiUrl}/terrain`, {
      method: 'HEAD',
      headers: { 'Accept': 'application/json' },
      // Establecer un timeout corto para no bloquear la UI
      signal: AbortSignal.timeout(3000)
    });
    
    const isAvailable = response.ok;
    
    return isAvailable;
  } catch (error) {
    console.error('Error al verificar disponibilidad de API:', error);
    return false;
  }
};

/**
 * Función auxiliar para construir URLs de API de manera segura
 * @param {string} endpoint - Ruta relativa de la API
 * @param {Object} params - Parámetros para la URL
 * @returns {string} - URL completa
 */
const buildApiUrl = (endpoint, params = {}) => {
  // Obtener la URL base desde las variables de entorno
  let baseUrl = import.meta.env.VITE_API_URL || '';
  
  
  
  // Si no hay una URL base definida, usamos una predeterminada para desarrollo
  if (!baseUrl) {
    baseUrl = 'http://localhost:8000/api';
    console.log('No se encontró VITE_API_URL, usando URL predeterminada:', baseUrl);
  }
  
  // Si la base URL no incluye /api y no estamos accediendo a una ruta de autenticación, añadirlo
  if (!baseUrl.includes('/api') && !endpoint.startsWith('login') && !endpoint.startsWith('register')) {
    baseUrl = `${baseUrl}/api`;
    
  }
  
  // Eliminar barras finales para formar URLs correctamente
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Eliminar barras iniciales del endpoint
  endpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Construir la URL con los parámetros
  let url = `${baseUrl}/${endpoint}`;
  
  // Añadir parámetros de consulta si existen
  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    url = `${url}?${queryParams.toString()}`;
  }
  
  
  
  return url;
};

/**
 * Componente para mostrar y gestionar los comentarios de una ruta
 * @param {Object} props
 * @param {Object} props.ruta - Datos de la ruta
 * @param {Function} props.onCommentAdded - Función a ejecutar cuando se añade un comentario
 */
const RouteComments = ({ ruta, onCommentAdded }) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  // Estados para los comentarios
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  
  // Estados para el formulario de comentarios
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // Referencia para implementar infinite scroll
  const observerTarget = useRef(null);
  
  // Maneja la animación de entrada y salida del modal
  const openModal = () => {
    setShowLoginModal(true);
    setIsClosing(false);
    setTimeout(() => setModalVisible(true), 10);
  };
  
  const closeModal = () => {
    setIsClosing(true);
    setModalVisible(false);
    setTimeout(() => {
      setShowLoginModal(false);
      setIsClosing(false);
    }, 300);
  };  
  
  // Función para cargar comentarios desde la API
  const loadComments = useCallback(async (page = 1, reset = false) => {
    if (!ruta?.id || isLoadingComments) return;
    
    setIsLoadingComments(true);
    setApiError(null);
    
    try {
      // Verificar si la API está disponible
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiAvailable = await checkApiAvailability(baseUrl);
      
      if (!apiAvailable) {
        setIsApiAvailable(false);
        throw new Error("No se puede conectar con el servidor. Asegúrate de que el servidor de Laravel esté en ejecución.");
      }
      
      setIsApiAvailable(true);
      
      // Usar la función auxiliar para construir la URL
      const url = buildApiUrl(`routes/${ruta.id}/comments`, { 
        page: page, 
        perPage: 5 
      });
      
      
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Verificar el estado de la respuesta antes de intentar procesar el cuerpo
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}: ${errorText}`);
        setApiError(`Error ${response.status}: No se pudieron cargar los comentarios`);
        throw new Error(`Error al cargar comentarios: ${response.statusText}`);
      }
      
      // Intentar parsear la respuesta como JSON
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error en la respuesta:', data);
        throw new Error(data.message || 'Error al cargar comentarios');
      }
      
      if (reset) {
        setComments(data.data || []);
      } else {
        setComments(prev => [...prev, ...(data.data || [])]);
      }
      
      const currentPage = data.pagination?.current_page || 1;
      const lastPage = data.pagination?.last_page || 1;
      
      setHasMoreComments(currentPage < lastPage);
      setCurrentPage(currentPage);
      
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setIsLoadingComments(false);
    }
  }, [ruta?.id]);
  
  // Función para enviar un nuevo comentario
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      openModal();
      return;
    }
    
    if (!newComment.trim() || rating < 1 || rating > 5) return;
    
    setIsSubmittingComment(true);
      try {
      // Usar la función auxiliar para construir la URL
      const url = buildApiUrl('comment');
      
      
      // console.log('Datos del comentario:', {
      //   comment: newComment,
      //   score: rating,
      //   route_id: ruta.id
      // });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          comment: newComment,
          score: rating,
          route_id: ruta.id
        })
      });
      
      // Verificar el estado de la respuesta antes de intentar procesar el cuerpo
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}: ${errorText}`);
        throw new Error(`Error al enviar comentario: ${response.statusText}`);
      }
      
      // Intentar parsear la respuesta como JSON
      const data = await response.json();
      
      
      if (!response.ok) {
        console.error('Error en la respuesta:', data);
        throw new Error(data.message || 'Error al enviar el comentario');
      }
      
      // Resetear el formulario
      setNewComment('');
      setRating(5);
      
      // Recargar los comentarios para mostrar el nuevo
      loadComments(1, true);
      
      // Notificar que se ha añadido un comentario
      if (onCommentAdded && typeof onCommentAdded === 'function') {
        onCommentAdded();
      }
      
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  // Función para eliminar un comentario
  const deleteComment = async (commentId) => {
    if (!user) {
      openModal();
      return;
    }
    
    try {
      // Asegurarse de que la URL se construya correctamente
      const apiUrl = buildApiUrl(`comment/${commentId}`);
      
      
      // Obtener el token desde localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      // Realizar la solicitud DELETE con el token correcto
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Verificar el estado de la respuesta antes de intentar procesar el cuerpo
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}: ${errorText}`);
        throw new Error(`Error al eliminar comentario: ${response.statusText}`);
      }
      
      
      
      // Filtrar el comentario eliminado de la lista local
      setComments(comments.filter(comment => comment.id !== commentId));
      
      // Notificar que se ha eliminado un comentario
      if (onCommentAdded && typeof onCommentAdded === 'function') {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      // Mostrar un mensaje de error al usuario
      alert('No se pudo eliminar el comentario. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  // Configurar el observador para infinite scroll
  useEffect(() => {
    if (!observerTarget.current || !hasMoreComments) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreComments && !isLoadingComments) {
          loadComments(currentPage + 1);
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(observerTarget.current);
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMoreComments, isLoadingComments, currentPage, loadComments]);
  
  // Cargar comentarios al montar el componente
  useEffect(() => {
    if (ruta?.id) {
      loadComments(1, true);
    }
  }, [ruta?.id, loadComments]);
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Componente para estrellas de calificación
  const RatingStars = ({ score, interactive = false, onChange = null }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            type="button"
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
            disabled={!interactive}
          >
            <svg 
              className={`w-5 h-5 ${star <= score ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Comentarios
      </h2>
      
      {/* Formulario para añadir comentario */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Deja un comentario</h3>
        <form onSubmit={handleSubmitComment}>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label className="block text-gray-700 mr-3">Tu valoración:</label>
              <RatingStars score={rating} interactive={true} onChange={setRating} />
            </div>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="3"
              placeholder={user ? "Escribe tu comentario..." : "Escribe tu comentario (necesitarás iniciar sesión para publicarlo)"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              className={`${
                isSubmittingComment || !newComment.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800'
              } text-white px-4 py-2 rounded-md transition duration-300`}
            >
              {isSubmittingComment ? 'Enviando...' : 'Enviar comentario'}
            </button>
          </div>
        </form>
      </div>
        {/* Lista de comentarios */}
      <div className="space-y-6">      
      {!isApiAvailable ? (
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <h3 className="font-semibold text-yellow-800 mb-2">Problemas de conexión</h3>
            <p className="text-yellow-700">
              No se puede conectar con el servidor. Asegúrate de que:
            </p>
            <ul className="list-disc ml-5 mt-2 text-yellow-700">
              <li>El servidor de Laravel esté en ejecución con: <code>php artisan serve</code></li>
              <li>La URL de la API sea correcta (actualmente: {import.meta.env.VITE_API_URL || 'No configurada'})</li>
              <li>Las rutas de la API estén correctamente definidas</li>
            </ul>
            <div className="mt-3 p-3 bg-gray-100 rounded text-sm font-mono">
              <p className="text-gray-700">Para iniciar el servidor Laravel:</p>
              <p className="text-gray-900 mt-1">1. Abre una terminal en: <code>c:\laragon\www\johny-motorbike</code></p>
              <p className="text-gray-900 mt-1">2. Ejecuta: <code>php artisan serve</code></p>
            </div>
            <button 
              onClick={() => loadComments(1, true)}
              className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
            >
              Reintentar
            </button>
          </div>
        ) : apiError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-semibold text-red-700 mb-2">Error al cargar comentarios</h3>
            <p className="text-red-600">{apiError}</p>
            <button 
              onClick={() => loadComments(1, true)}
              className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
            >
              Reintentar
            </button>
          </div>
        ) : comments && comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-grow">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-semibold text-white">
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-800">
                          {comment.user_id ? (
                            <Link
                              to={`/usuarios/${comment.user_id}`}
                              className="hover:text-blue-700 hover:underline transition-colors"
                            >
                              {comment.user?.name || 'Usuario anónimo'}
                            </Link>
                          ) : (
                            comment.user?.name || 'Usuario anónimo'
                          )}
                        </h4>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <RatingStars score={comment.score} />
                      <p className="mt-1 text-gray-600">{comment.comment}</p>
                    </div>
                  </div>

                  {/* Botón para eliminar con ícono X */}
                  {user && user.id === comment.user_id && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
                      title="Eliminar comentario"
                      aria-label="Eliminar comentario"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Elemento observado para infinite scroll */}
            {hasMoreComments && (
              <div 
                ref={observerTarget} 
                className="flex justify-center py-4"
              >
                {isLoadingComments ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-blue-700 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cargando más comentarios...</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Desplázate para cargar más comentarios</span>
                )}
              </div>
            )}
          </>
        ) : isLoadingComments ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-700 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Cargando comentarios...</span>
          </div>
        ) : (
          <p className="text-gray-600 italic">No hay comentarios para esta ruta. ¡Sé el primero en comentar!</p>
        )}
      </div>
        {/* Modal con animación */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div
            id="modal-login-popup"
            className={`bg-white/80 rounded-lg shadow-lg p-6 w-full max-w-xs text-center transform transition-all duration-300 z-[1001] relative
              ${modalVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          >
            <h4 className="text-lg font-bold mb-2 text-blue-800">Acción no permitida</h4>
            <p className="mb-4 text-gray-700">Para poder comentar, regístrate o inicia sesión.</p>
            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md font-semibold"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </button>
              <button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md font-semibold"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteComments;
