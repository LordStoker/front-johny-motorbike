import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import defaultRouteImage from '../assets/default-route-image.jpg'

/**
 * Componente que muestra los detalles de una ruta específica
 * @param {Object} props
 * @param {Object} props.ruta - Datos completos de la ruta a mostrar
 */
const RutaDetail = ({ ruta }) => {
  const { user, checkFavorite, toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
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
  const handleToggleFavorite = async () => {
    if (!user) {
      openModal();
      return;
    }
    
    setIsLoadingFavorite(true);
    const result = await toggleFavorite(ruta.id);
    setIsFavorite(result);
    setIsLoadingFavorite(false);
  };

  if (!ruta) return null

  return (
    <>
      {/* Cabecera con botón de volver */}      <div className="flex items-center justify-between mb-6">
        <div>
          <Link 
            to="/rutas" 
            className="flex items-center text-blue-700 hover:text-blue-900 mr-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a rutas
          </Link>
        </div>
        
        {/* Botón de favoritos */}
        <button 
          onClick={handleToggleFavorite}
          disabled={isLoadingFavorite}
          className={`flex items-center justify-center px-4 py-2 rounded-full transition-all ${
            isFavorite 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isLoadingFavorite ? (
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              fill={isFavorite ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          <span>{isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}</span>
        </button>
      </div>

      {/* Título y datos principales */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Imágenes */}
        <div className="md:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={ruta.route_images && ruta.route_images.length > 0 ? ruta.route_images[0].url : defaultRouteImage} 
              alt={ruta.name} 
              className="w-full h-80 object-cover"
            />
          </div>
          {/* Galería de imágenes adicionales */}
          {ruta.route_images && ruta.route_images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {ruta.route_images.slice(1, 5).map((img, index) => (
                <div key={index} className="rounded-md overflow-hidden">
                  <img 
                    src={img.url} 
                    alt={`${ruta.name} - imagen ${index + 2}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información de la ruta */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">{ruta.name}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-800">{ruta.distance} km</span>
            </div>

            <div className={`rounded-lg px-4 py-2 flex items-center
              ${ruta.difficulty?.name === 'Fácil' ? 'bg-green-100 text-green-800' :
              ruta.difficulty?.name === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
              ruta.difficulty?.name === 'Difícil' ? 'bg-red-100 text-red-800' :
              'bg-purple-100 text-purple-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Dificultad: {ruta.difficulty?.name || 'No especificada'}</span>
            </div>

            {ruta.country && (
              <div className="bg-blue-50 text-blue-800 rounded-lg px-4 py-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span>{ruta.country.name}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {ruta.terrain && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                {ruta.terrain.name}
              </span>
            )}
            {ruta.landscape && (
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                {ruta.landscape.name}
              </span>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">{ruta.description}</p>
          </div>

          {/* Información del creador si está disponible */}
          {ruta.user && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">
                Ruta creada por <span className="font-medium">{ruta.user.name}</span> el {
                  new Date(ruta.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="mt-10 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Comentarios</h2>
        
        {ruta.comments && ruta.comments.length > 0 ? (
          <div className="space-y-6">
            {ruta.comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{comment.user?.name || 'Usuario anónimo'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </p>
                    <p className="mt-2 text-gray-700">{comment.content}</p>

                    {/* Imágenes del comentario si existen */}
                    {comment.comment_images && comment.comment_images.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {comment.comment_images.map((img, idx) => (
                          <div key={idx} className="rounded-md overflow-hidden">
                            <img 
                              src={img.url} 
                              alt={`Comentario imagen ${idx + 1}`}
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">No hay comentarios para esta ruta. ¡Sé el primero en comentar!</p>
        )}

        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Deja un comentario</h3>
          {user ? (
            <>
              <div className="mb-4">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows="3"
                  placeholder="Escribe tu comentario..."
                  disabled
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300 opacity-50 cursor-not-allowed"
                  disabled
                >
                  Comentar (próximamente)
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300"
                onClick={openModal}
              >
                Comentar
              </button>
              {/* Modal con animación de desplazamiento vertical */}
              {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                  <div
                    id="modal-login-popup"
                    className={`bg-white/80 rounded-lg shadow-lg p-6 w-full max-w-xs text-center transform transition-all duration-300
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
          )}
        </div>
      </div>
    </>
  )
}

export default RutaDetail