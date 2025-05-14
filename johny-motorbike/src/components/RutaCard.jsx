import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import defaultRouteImage from '../assets/default-route-image.jpg'
import { useAppContext } from '../context/AppContext'
import StarRating from './StarRating'
import RouteIcon from './RouteIcons'

/**
 * Componente para mostrar una tarjeta de ruta
 * @param {Object} props 
 * @param {Object} props.ruta - Datos de la ruta
 * @param {string} props.className - Clases adicionales para estilizar el contenedor
 */
const RutaCard = ({ ruta, className = '' }) => {
  const { user, checkFavorite, toggleFavorite, favoriteRouteIds } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Estados para manejar el modal de login
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
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
  
  // Verificar si la ruta es favorita al cargar el componente - versión altamente optimizada
  useEffect(() => {
    let isMounted = true; // Bandera para evitar actualizar el estado si el componente se desmonta
    
    const checkIfFavorite = async () => {
      if (user && ruta?.id) {
        // Evitamos cualquier renderización innecesaria precargando el estado
        // desde favoriteRouteIds que ya obtuvimos del contexto
        const parsedRouteId = parseInt(ruta.id);
        
        // Verificación local instantánea sin esperar al servidor
        if (favoriteRouteIds.has(parsedRouteId)) {
          if (isMounted) setIsFavorite(true);
          return; // Si ya sabemos que es favorita, no necesitamos consultar el servidor
        }
        
        // Si no sabemos con certeza, consultamos el servidor
        // pero solo si es necesario (el componente sigue montado)
        const favorite = await checkFavorite(ruta.id);
        if (isMounted) setIsFavorite(favorite);
      }
    };
    
    checkIfFavorite();
    
    // Limpieza para evitar memory leaks y actualizaciones después del desmontaje
    return () => {
      isMounted = false;
    };
  }, [user, ruta?.id, checkFavorite, favoriteRouteIds]);
    // Estado para manejar la animación del corazón
  const [heartKey, setHeartKey] = useState(0); // Clave para forzar una nueva animación  // Función para manejar el clic en el botón de favorito - versión optimizada
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Evitar que el enlace de la tarjeta se active
    e.stopPropagation();
    
    // Si el usuario no está logueado, mostramos el modal de login
    if (!user) {
      openModal();
      return;
    }
    
    // Actualizamos la UI inmediatamente sin esperar la respuesta del servidor
    setIsFavorite(!isFavorite); // Cambiamos el estado visual inmediatamente
    setHeartKey(prevKey => prevKey + 1); // Actualizamos la clave para forzar una nueva animación
    
    // El spinner solo se mostrará brevemente para indicar que la acción está en proceso
    // pero el cambio visual del corazón ya ocurrió
    setIsLoading(true);
    
    // Hacemos la petición a la API en segundo plano
    toggleFavorite(ruta.id)
      .then(result => {
        // Solo si el resultado difiere de nuestra actualización optimista, lo corregimos
        if (result !== !isFavorite) {
          setIsFavorite(result);
        }
      })
      .catch(error => {
        console.error('Error al cambiar estado de favorito:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  // Si no hay datos de la ruta, no mostrar nada
  if (!ruta) {
    return null;
  }
  
  // Imagen de la ruta o imagen por defecto
  const routeImage = ruta.route_images && ruta.route_images[0]
    ? `${import.meta.env.VITE_API_URL}/storage/${ruta.route_images[0].url}`
    : defaultRouteImage;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col ${className}`}>
      {/* Imagen de la ruta */}
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={routeImage}
          alt={ruta.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />        <button          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute top-3 right-3 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-sm transition-all active:scale-90 hover:shadow-md transform hover:-translate-y-0.5"
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >          {isLoading ? (
            <svg 
              className="animate-spin h-5 w-5 text-blue-500" 
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
          ) : (            <svg 
              xmlns="http://www.w3.org/2000/svg"
              key={heartKey} // Usando la clave para forzar una nueva animación
              className={`h-5 w-5 ${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-all duration-100 ${isFavorite ? 'animate-[pulse_0.3s_ease-in-out_1]' : 'hover:scale-110 hover:text-red-400'}`} 
              fill={isFavorite ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                className={isFavorite ? "animate-heartbeat" : ""}
              />
            </svg>
          )}
        </button>
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-blue-800 mb-2">{ruta.name}</h2>
        <p className="text-gray-700 mb-3 line-clamp-2">
          {ruta.description}
        </p>
          {/* Metadatos de la ruta */}
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 mb-3 gap-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{ruta.distance} km</span>
          </div>
            <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.floor(ruta.duration)} min</span>
          </div>
            <span className={`px-2 py-1 rounded-full flex items-center ${
            ruta.difficulty?.name === 'Fácil' ? 'bg-green-100 text-green-800' :
            ruta.difficulty?.name === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
            ruta.difficulty?.name === 'Difícil' ? 'bg-red-100 text-red-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            <RouteIcon 
              type="difficulty"
              name={ruta.difficulty?.name || 'No especificada'}
              size="sm"
              className="mr-1"
            />
            <span>{ruta.difficulty?.name || 'No especificada'}</span>
          </span>
        </div>
        
        {/* Comentarios y valoraciones */}
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          {/* Contador de comentarios */}
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{ruta.comments_count || 0}</span>
          </div>          {/* Valoración media con estrellas */}
          <StarRating 
            rating={ruta.totalScore && ruta.countScore ? ruta.totalScore / ruta.countScore : 0} 
            size="sm"
            showValue={true}
            className="hover:opacity-80 transition-opacity"
          />
        </div>        {/* Iconos de terreno y paisaje */}
        <div className="flex flex-wrap gap-3 mb-4">          {ruta.terrain && (
            <RouteIcon 
              type="terrain"
              name={ruta.terrain.name}
              size="md"
            />
          )}
          {ruta.landscape && (
            <RouteIcon 
              type="landscape"
              name={ruta.landscape.name}
              size="md"
            />
          )}
        </div>
        
        {/* Mostrar el país */}
        {ruta.country && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span>{typeof ruta.country === 'object' ? ruta.country.name : ruta.country}</span>
          </div>
        )}
        
        {/* Botón para ver detalles */}
        <Link 
          to={`/rutas/${ruta.id}`} 
          className="block text-center bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition mt-auto"
        >
          Ver detalles
        </Link>
      </div>
      
      {/* Estilos para animaciones avanzadas */}
      <style dangerouslySetInnerHTML={{
        __html: `
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
          
          @keyframes modalOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
          .animate-modal-out {
            animation: modalOut 0.2s ease-out forwards;
          }
        `
      }} />
      
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
    </div>
  )
}

export default RutaCard