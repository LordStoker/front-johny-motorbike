import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import defaultRouteImage from '../assets/default-route-image.jpg';
import RouteComments from './RouteComments';
import StarRating from './StarRating';

/**
 * Componente que muestra los detalles de una ruta específica
 * @param {Object} props
 * @param {Object} props.ruta - Datos completos de la ruta a mostrar
 */
const RutaDetail = ({ ruta: initialRoute }) => {
  const { user, checkFavorite, toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const [rutaData, setRutaData] = useState(initialRoute);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [heartKey, setHeartKey] = useState(0); // Clave para forzar una nueva animación
  const [feedbackMessage, setFeedbackMessage] = useState(null); // Estado para controlar el mensaje de feedback
  
  // Maneja la animación de entrada y salida del modal
  const openModal = () => {
    setShowLoginModal(true);
    setIsClosing(false);
    setTimeout(() => setModalVisible(true), 10); // Espera para activar la animación de entrada
  };
  const closeModal = () => {
    setIsClosing(true);
    setModalVisible(false);
    setTimeout(() => {
      setShowLoginModal(false);
      setIsClosing(false);
    }, 300);
  };
  
  // Función para obtener los detalles actualizados de la ruta
  const fetchRouteDetails = async (routeId) => {
    if (!routeId) return;
    
    setIsRefreshing(true);
    try {
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/route/${routeId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la ruta');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setRutaData(data.data);
      }
    } catch (error) {
      console.error('Error al refrescar los detalles de la ruta:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Inicializar rutaData con initialRoute cuando cambie
  useEffect(() => {
    setRutaData(initialRoute);
  }, [initialRoute]);
    // Verificar si la ruta es favorita al cargar el componente - versión optimizada
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user && rutaData?.id) {
        // Usamos la función optimizada checkFavorite que consulta el Set local primero
        const favorite = await checkFavorite(rutaData.id);
        setIsFavorite(favorite);
      }
    };

    checkIfFavorite();
    // Quitamos checkFavorite de las dependencias ya que ahora está memoizada con useCallback
  }, [user, rutaData?.id]);
  
  // Función para manejar el clic en el botón de favorito - versión optimizada
  const handleToggleFavorite = async () => {
    if (!user) {
      openModal();
      return;
    }
    
    // Actualizamos la UI inmediatamente sin esperar la respuesta del servidor
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState); // Cambiamos el estado visual inmediatamente
    setHeartKey(prevKey => prevKey + 1); // Actualizamos la clave para forzar una nueva animación
    
    // El spinner solo se mostrará brevemente para indicar que la acción está en proceso
    // pero el cambio visual del corazón ya ocurrió
    setIsLoadingFavorite(true);
    
    // Mostrar mensaje de feedback temporal
    setFeedbackMessage(newFavoriteState ? 'Añadido a favoritos' : 'Eliminado de favoritos');
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 2000);
    
    // Hacemos la petición a la API en segundo plano
    toggleFavorite(rutaData.id)
      .then(result => {
        // Solo si el resultado difiere de nuestra actualización optimista, lo corregimos
        if (result !== newFavoriteState) {
          setIsFavorite(result);
          // Si hubo un error, mostramos mensaje corregido
          setFeedbackMessage(result ? 'Añadido a favoritos' : 'Eliminado de favoritos');
          setTimeout(() => {
            setFeedbackMessage(null);
          }, 2000);
        }
      })
      .catch(error => {
        console.error('Error al cambiar estado de favorito:', error);
        // Mostrar mensaje de error
        setFeedbackMessage('Error al actualizar favoritos');
        setTimeout(() => {
          setFeedbackMessage(null);
        }, 2000);
      })
      .finally(() => {
        setIsLoadingFavorite(false);
      });
  };

  // Manejar cuando se añade un nuevo comentario
  const handleCommentAdded = async () => {
    if (rutaData?.id) {
      await fetchRouteDetails(rutaData.id);
    }
  };

  if (!rutaData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Cargando detalles de la ruta...</p>
      </div>
    );
  }
  
  // Extraer primera imagen o usar imagen por defecto
  const mainImage = rutaData.route_images && rutaData.route_images[0] 
    ? `${import.meta.env.VITE_API_URL}/storage/${rutaData.route_images[0].url}`
    : defaultRouteImage;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cabecera con imagen principal y título */}
        <div className="relative">
          <div className="w-full h-64 sm:h-96 overflow-hidden">
            <img 
              src={mainImage}
              alt={rutaData.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleToggleFavorite}
              disabled={isLoadingFavorite}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-150 active:scale-90 hover:shadow-lg transform hover:-translate-y-0.5"
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isLoadingFavorite ? (
                <svg 
                  className="animate-spin h-6 w-6 text-blue-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25"
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  key={heartKey} // Usando la clave para forzar una nueva animación
                  className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-all duration-100 ${isFavorite ? 'animate-[pulse_0.3s_ease-in-out_1] scale-110' : 'hover:scale-110 hover:text-red-400'}`}
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    className={isFavorite ? "animate-heartbeat" : ""}
                  />
                </svg>
              )}
            </button>
            {/* Mensaje de feedback */}
            {feedbackMessage && (
              <div className="absolute top-16 right-4 transform transition-opacity duration-300 opacity-90">
                <div className={`bg-blue-700 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out`}>
                  {feedbackMessage}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-3">{rutaData.name}</h1>
          
          {/* Metadatos de la ruta */}
          <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{rutaData.distance} km</span>
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{rutaData.duration} minutos</span>
            </div>
            
            <div className="flex items-center">
              {rutaData.totalScore && rutaData.countScore ? (
                <StarRating 
                  rating={rutaData.totalScore / rutaData.countScore} 
                  size="md"
                  showValue={true}
                  className="hover:opacity-80 transition-opacity"
                />
              ): (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Sin calificación</span>
                </>
              )}
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>
                {rutaData.comments_count}
                {rutaData.comments_count === 1 ? ' comentario' : ' comentarios'}
              </span>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              rutaData.difficulty?.name === 'Fácil' ? 'bg-green-100 text-green-800' :
              rutaData.difficulty?.name === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
              rutaData.difficulty?.name === 'Difícil' ? 'bg-red-100 text-red-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {rutaData.difficulty?.name || 'No especificada'}
            </div>
          </div>
          
          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2 mb-6">
            {rutaData.terrain && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {rutaData.terrain.name}
              </span>
            )}
            {rutaData.landscape && (
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {rutaData.landscape.name}
              </span>
            )}
            {rutaData.country && (
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {rutaData.country.name}
              </span>
            )}
          </div>
          
          {/* Descripción */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h2>
            <p className="text-gray-600 leading-relaxed">{rutaData.description}</p>
          </div>
          
          {/* Galería de imágenes */}
          {rutaData.route_images && rutaData.route_images.length > 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Galería</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {rutaData.route_images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md h-40">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}/storage/${image.url}`}
                      alt={`${rutaData.name} - Imagen ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Mapa */}
          {rutaData.route_map && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Mapa de la ruta</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden p-2 bg-gray-50">
                <div dangerouslySetInnerHTML={{ __html: rutaData.route_map }} className="w-full h-64 sm:h-96" />
              </div>
            </div>
          )}
          
          {/* Indicador de actualización */}
          {isRefreshing && (
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
              <span className="ml-2 text-blue-700 text-sm">Actualizando información...</span>
            </div>
          )}
          
          {/* Sección de comentarios */}
          <RouteComments 
            ruta={rutaData}
            onCommentAdded={handleCommentAdded}
          />
        </div>
        
        {/* Estilos para las animaciones */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInOut {
              0% { opacity: 0; transform: translateY(-10px); }
              10% { opacity: 1; transform: translateY(0); }
              90% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-10px); }
            }
            .animate-fade-in-out {
              animation: fadeInOut 2s ease forwards;
            }
            
            @keyframes heartbeat {
              0% { transform: scale(1); }
              25% { transform: scale(1.2); }
              50% { transform: scale(1); }
              75% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            .animate-heartbeat {
              animation: heartbeat 0.5s ease-in-out;
            }
          `
        }} />
      </div>
      
      {/* Modal de inicio de sesión */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${modalVisible ? 'opacity-50' : 'opacity-0'}`}></div>
          <div className={`bg-white rounded-lg shadow-xl overflow-hidden w-11/12 max-w-md mx-auto transform transition-all duration-300 ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${isClosing ? 'animate-modal-out' : ''}`}>
            <div className="relative p-6">
              <button 
                onClick={closeModal} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Necesitas iniciar sesión</h3>
              <p className="text-gray-600 mb-6">
                Para añadir rutas a favoritos necesitas iniciar sesión con tu cuenta. 
                Si aún no tienes una cuenta, puedes registrarte.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Animación para el modal */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes modalOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
          .animate-modal-out {
            animation: modalOut 0.2s ease-out forwards;
          }
        `
      }} />
    </div>
  );
};

export default RutaDetail;
