import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import backgroundImage from '../assets/johny-motorbike.jpg'
import defaultRouteImage from '../assets/default-route-image.jpg'
import RutaCard from '../components/RutaCard'

export default function Home() {
  const { routes, loading } = useAppContext()
  
  // Obtener las 3 rutas más populares (para este ejemplo, simplemente tomamos las primeras 3)
  const popularRoutes = routes.slice(0, 3)
  
  return (
    <>
      {/* Hero Section con fondo de imagen */}
      <section className="relative h-screen flex items-center bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 z-10 pt-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
              Explora el Mundo en Dos Ruedas
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Descubre las mejores rutas para tus aventuras en moto y comparte tus experiencias con otros apasionados.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/rutas" 
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                Ver todas las rutas
              </Link>
              <Link 
                to="/nueva-ruta" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-800 px-6 py-3 rounded-lg font-semibold transition duration-300"
              >
                Crear nueva ruta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">
            Nuestras Características
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Explora</h3>
              <p className="text-gray-600 mb-4">
                Descubre las rutas más emocionantes y perfectamente detalladas para tus viajes en moto.
              </p>
              <Link to="/rutas" className="text-blue-700 font-semibold hover:text-blue-900 flex items-center">
                Ver rutas
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition duración-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Conecta</h3>
              <p className="text-gray-600 mb-4">
                Únete a otros motociclistas entusiastas y descubre nuevas amistades con la misma pasión.
              </p>
              <a href="#" className="text-blue-700 font-semibold hover:text-blue-900 flex items-center">
                Saber más
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de rutas populares */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">
            Rutas Populares
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
              <p className="mt-4 text-gray-700">Cargando rutas populares...</p>
            </div>
          ) : (
            <>
              {popularRoutes.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  No hay rutas disponibles actualmente. ¡Sé el primero en crear una!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularRoutes.map(ruta => (
                    <RutaCard key={ruta.id} ruta={ruta} className="h-full" />
                  ))}
                </div>
              )}
              
              <div className="mt-10 text-center">
                <Link 
                  to="/rutas" 
                  className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                >
                  Ver todas las rutas
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}