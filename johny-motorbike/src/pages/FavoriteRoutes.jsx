import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import RutaCard from '../components/RutaCard';

export default function FavoriteRoutes() {
  const { user, favoriteRoutes, loadingFavorites, loadFavoriteRoutes, favoriteRouteIds } = useAppContext();
  const navigate = useNavigate();
  const [visibleRoutes, setVisibleRoutes] = useState([]);
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false);
  
  // Redirigir al usuario si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
    // Cargar las rutas favoritas cuando el componente se monte, con optimizaciones de rendimiento
  useEffect(() => {
    if (user) {
      // Primero verificamos si ya tenemos datos de favoritos en caché
      const hasExistingData = favoriteRouteIds && favoriteRouteIds.size > 0;
      
      // Si ya tenemos datos, mostramos la animación más breve
      setShowRefreshIndicator(true);
      
      // Si ya tenemos datos en caché, usamos una estrategia optimizada
      if (hasExistingData) {
        // Para una mejor experiencia de usuario, mostramos los datos existentes inmediatamente
        // y luego actualizamos en segundo plano
        setTimeout(() => {
          loadFavoriteRoutes().finally(() => {
            setTimeout(() => {
              setShowRefreshIndicator(false);
            }, 300);
          });
        }, 100);
      } else {
        // Si no tenemos datos, cargamos normalmente
        loadFavoriteRoutes().finally(() => {
          setTimeout(() => {
            setShowRefreshIndicator(false);
          }, 500);
        });
      }
    }
  }, [user]);
  
  // Efecto para animar las tarjetas cuando cambia la lista de favoritos
  useEffect(() => {
    // Si hay nuevas rutas, las mostramos con animación
    setVisibleRoutes(favoriteRoutes);
  }, [favoriteRoutes]);

  if (!user) {
    return null; // No renderizar nada si el usuario no está autenticado
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Rutas Favoritas</h1>
        
        {/* Indicador de actualización */}
        {showRefreshIndicator && (
          <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Actualizando</span>
          </div>
        )}
      </div>
      
      {loadingFavorites && visibleRoutes.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-700">Cargando tus rutas favoritas...</p>
        </div>
      ) : (
        <>
          {visibleRoutes.length === 0 ? (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2 text-blue-800">No tienes rutas favoritas</h2>
              <p className="text-gray-600 mb-6">
                Explora nuestro catálogo de rutas y guarda tus favoritas para acceder a ellas fácilmente.
              </p>
              <button
                onClick={() => navigate('/rutas')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Explorar rutas
              </button>
            </div>          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleRoutes.map((ruta, index) => (
                <div 
                  key={ruta.id} 
                  className="transform transition-all duration-500"
                  style={{ 
                    animation: 'fadeIn 0.5s ease-out forwards',
                    animationDelay: `${index * 100}ms`,
                    opacity: 0
                  }}
                >
                  <RutaCard ruta={ruta} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Estilos para la animación de aparición - React no soporta directamente style JSX así que usamos la etiqueta style */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </div>
  );
}
