import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import defaultRouteImage from '../assets/default-route-image.jpg'
import { useAppContext } from '../context/AppContext'

/**
 * Componente para mostrar una tarjeta de ruta
 * @param {Object} props 
 * @param {Object} props.ruta - Datos de la ruta
 * @param {string} props.className - Clases adicionales para estilizar el contenedor
 */
const RutaCard = ({ ruta, className = '' }) => {
  const { user, checkFavorite, toggleFavorite } = useAppContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Verificar si la ruta es favorita al cargar el componente
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user && ruta?.id) {
        const favorite = await checkFavorite(ruta.id);
        setIsFavorite(favorite);
      }
    };
    
    checkIfFavorite();
  }, [user, ruta?.id, checkFavorite]);
  
  // Función para manejar el clic en el botón de favorito
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Evitar que el enlace de la tarjeta se active
    e.stopPropagation();
    
    // Si el usuario no está logueado, redirigir al login
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    const result = await toggleFavorite(ruta.id);
    setIsFavorite(result);
    setIsLoading(false);
  };
  
  if (!ruta) return null

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition ${className}`}
    >
      {/* Imagen de la ruta */}      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={ruta.route_images && ruta.route_images.length > 0 ? ruta.route_images[0].url : defaultRouteImage} 
          alt={ruta.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Botón de favorito */}
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isFavorite 
              ? 'bg-red-100 text-red-500 hover:bg-red-200' 
              : 'bg-white/80 text-gray-600 hover:bg-gray-100'
          } transition-colors shadow-md`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="p-5">
        {/* Título y descripción */}
        <h2 className="text-xl font-bold text-blue-800 mb-2">{ruta.name}</h2>
        <p className="text-gray-700 mb-3 line-clamp-2">
          {ruta.description}
        </p>
        
        {/* Metadatos de la ruta */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{ruta.distance} km</span>
          </div>
          
          <span className={`px-2 py-1 rounded-full ${
            ruta.difficulty?.name === 'Fácil' ? 'bg-green-100 text-green-800' :
            ruta.difficulty?.name === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
            ruta.difficulty?.name === 'Difícil' ? 'bg-red-100 text-red-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {ruta.difficulty?.name || 'No especificada'}
          </span>
        </div>
        
        {/* Etiquetas de terreno y paisaje */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ruta.terrain && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              {ruta.terrain.name}
            </span>
          )}
          {ruta.landscape && (
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
              {ruta.landscape.name}
            </span>
          )}
        </div>
        
        {/* Botón para ver detalles */}
        <Link 
          to={`/rutas/${ruta.id}`} 
          className="block text-center bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  )
}

export default RutaCard