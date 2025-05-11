import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import RutaCard from '../components/RutaCard';

export default function FavoriteRoutes() {
  const { user, favoriteRoutes, loadingFavorites, loadFavoriteRoutes } = useAppContext();
  const navigate = useNavigate();

  // Redirigir al usuario si no está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  // Cargar las rutas favoritas cuando el componente se monte
  useEffect(() => {
    if (user) {
      loadFavoriteRoutes();
    }
    // loadFavoriteRoutes se eliminó de las dependencias para evitar bucles infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return null; // No renderizar nada si el usuario no está autenticado
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Mis Rutas Favoritas</h1>
      
      {loadingFavorites ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-700">Cargando tus rutas favoritas...</p>
        </div>
      ) : (
        <>
          {favoriteRoutes.length === 0 ? (
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
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRoutes.map(ruta => (
                <RutaCard key={ruta.id} ruta={ruta} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
