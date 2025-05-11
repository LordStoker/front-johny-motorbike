import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import RutaCard from '../components/RutaCard'

export default function Rutas() {
  const { routes, loading, error, user, loadFavoriteRouteIds } = useAppContext()
    // Precargamos los IDs de rutas favoritas al renderizar la página con una estrategia optimizada
  useEffect(() => {
    if (user) {
      // Usamos requestIdleCallback (o un polyfill) para cargar favoritos cuando el navegador esté inactivo
      // Esto evita bloquear el renderizado inicial de la página
      const loadFavoritesWhenIdle = () => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            loadFavoriteRouteIds();
          }, { timeout: 2000 }); // Con timeout para asegurar que se ejecute incluso en navegadores ocupados
        } else {
          // Fallback para navegadores que no soportan requestIdleCallback
          setTimeout(() => {
            loadFavoriteRouteIds();
          }, 100);
        }
      };
      
      loadFavoritesWhenIdle();
    }
  }, [user, loadFavoriteRouteIds]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
        <p className="mt-4 text-gray-700">Cargando rutas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600">Error al cargar las rutas: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Rutas Disponibles</h1>
        <Link 
          to="/nueva-ruta" 
          className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Crear Nueva Ruta
        </Link>
      </div>

      {routes.length === 0 ? (
        <p className="text-gray-700 text-center py-16">No hay rutas disponibles actualmente.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map(ruta => (
            <RutaCard key={ruta.id} ruta={ruta} />
          ))}
        </div>
      )}
    </div>
  )
}