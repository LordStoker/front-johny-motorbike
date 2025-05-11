import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import RutaDetail from '../components/RutaDetail'

export default function ShowRuta() {
  const { id } = useParams()
  const { routes, loading, error, user, loadFavoriteRouteIds } = useAppContext()
  const [ruta, setRuta] = useState(null)
  useEffect(() => {
    // Buscar la ruta por su ID cuando los datos estén disponibles
    if (routes.length > 0) {
      const foundRuta = routes.find(r => r.id.toString() === id)
      setRuta(foundRuta || null)
    }
  }, [routes, id])
    // Precargamos los IDs de rutas favoritas al renderizar la página
  useEffect(() => {
    if (user) {
      loadFavoriteRouteIds();
    }
    // Quitamos loadFavoriteRouteIds de las dependencias ya que ahora está memoizada con useCallback
  }, [user])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
        <p className="mt-4 text-gray-700">Cargando información de la ruta...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600">Error al cargar la información: {error}</p>
      </div>
    )
  }

  if (!ruta) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Ruta no encontrada</h1>
        <p className="text-gray-700 mb-6">Lo sentimos, no pudimos encontrar la ruta que estás buscando.</p>
        <Link 
          to="/rutas" 
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
        >
          Volver a todas las rutas
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RutaDetail ruta={ruta} />
    </div>
  )
}