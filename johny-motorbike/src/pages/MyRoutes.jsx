import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import RutaCard from '../components/RutaCard';

export default function MyRoutes() {
  const { user, routes } = useAppContext();
  const navigate = useNavigate();
  const [myRoutes, setMyRoutes] = useState([]);
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false);
  
  // Redirigir al usuario si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Cargar las rutas creadas por el usuario cuando el componente se monte
  useEffect(() => {
    if (user && routes.length > 0) {
      setShowRefreshIndicator(true);
      
      // Filtrar las rutas creadas por el usuario actual
      const userRoutes = routes.filter(route => route.user_id === user.id);
      setMyRoutes(userRoutes);
      
      setTimeout(() => {
        setShowRefreshIndicator(false);
      }, 500);
    }
  }, [user, routes]);

  if (!user) {
    return null; // No renderizar nada si el usuario no está autenticado
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Mis Rutas</h1>
      
      {showRefreshIndicator && (
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
          <span className="ml-2 text-blue-700 text-sm">Cargando tus rutas...</span>
        </div>
      )}

      {!showRefreshIndicator && (
        <>
          {myRoutes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-blue-800">No has creado rutas todavía</h2>
              <p className="text-gray-600 mb-6">
                Crea tu primera ruta para compartirla con la comunidad.
              </p>
              <button
                onClick={() => navigate('/nueva-ruta')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Crear nueva ruta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRoutes.map((ruta, index) => (
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

      {/* Estilos para la animación de aparición */}
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
