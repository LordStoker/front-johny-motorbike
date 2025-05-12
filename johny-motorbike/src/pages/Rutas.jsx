import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useAppContext } from '../context/AppContext'
import RutaCard from '../components/RutaCard'
import FilterBar from '../components/FilterBar'

export default function Rutas() {
  const { routes, loading, error, user, loadFavoriteRouteIds } = useAppContext()
  const [filteredRoutes, setFilteredRoutes] = useState([])  // Constantes para los valores máximos de filtros
  const MAX_DISTANCE = 500; // 500+ km (filtro abierto)
  const MAX_DURATION = 480; // 480+ minutos (8 horas) (filtro abierto)
  
  const [activeFilters, setActiveFilters] = useState({
    distance: [0, MAX_DISTANCE],
    duration: [0, MAX_DURATION],
    landscapes: [],
    difficulties: [],
    terrains: [],
    rating: 0,
    countries: [],
    searchText: ''
  })
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
    }  }, [user, loadFavoriteRouteIds]);
  // Efecto para filtrar rutas cuando cambian los filtros o las rutas
  useEffect(() => {
    if (!routes || routes.length === 0) {
      setFilteredRoutes([]);
      return;
    }    // Mostrar información de filtrado y rutas en la consola para depuración
    if (activeFilters.countries.length > 0 && routes.length > 0) {
      // Analizar todas las rutas para encontrar países
      const countryData = routes.map(ruta => ({
        name: ruta.name,
        country_id: ruta.country_id,
        country_object: ruta.country,
        matches: activeFilters.countries.includes(ruta.country_id) || 
                (ruta.country && activeFilters.countries.includes(ruta.country.id))
      }));
    }

    // Filtrar rutas según los criterios seleccionados
    const filtered = routes.filter(ruta => {// Filtro por distancia
      const distance = Number(ruta.distance);
      // Si el valor máximo del slider es igual al máximo permitido (500), solo aplicamos el filtro mínimo
      if (distance < activeFilters.distance[0] || 
          (activeFilters.distance[1] < MAX_DISTANCE && distance > activeFilters.distance[1])) {
        return false;
      }
      
      // Filtro por duración
      const duration = Number(ruta.duration);
      // Si el valor máximo del slider es igual al máximo permitido (480), solo aplicamos el filtro mínimo
      if (duration < activeFilters.duration[0] || 
          (activeFilters.duration[1] < MAX_DURATION && duration > activeFilters.duration[1])) {
        return false;
      }
      
      // Filtro por paisaje
      if (activeFilters.landscapes.length > 0 && 
          (!ruta.landscape || !activeFilters.landscapes.includes(ruta.landscape.id))) {
        return false;
      }
      
      // Filtro por dificultad
      if (activeFilters.difficulties.length > 0 && 
          (!ruta.difficulty || !activeFilters.difficulties.includes(ruta.difficulty.id))) {
        return false;
      }
      
      // Filtro por terreno
      if (activeFilters.terrains.length > 0 && 
          (!ruta.terrain || !activeFilters.terrains.includes(ruta.terrain.id))) {
        return false;
      }      // Filtro por país
      if (activeFilters.countries.length > 0) {
        // Determinar el ID del país de la ruta
        let countryId = null;

        // Buscar el ID del país en todas las posibles ubicaciones
        if (ruta.country_id) {
          countryId = ruta.country_id;
        } else if (ruta.country && typeof ruta.country === 'object') {
          countryId = ruta.country.id;
        } else if (typeof ruta.country === 'number') {
          countryId = ruta.country;
        }
        
        // Si no hay coincidencia con ningún país seleccionado, filtrar esta ruta
        if (countryId === null || !activeFilters.countries.includes(countryId)) {
          return false;
        }
      }
      
      // Filtro por valoración
      const rating = ruta.totalScore && ruta.countScore ? ruta.totalScore / ruta.countScore : 0;
      if (rating < activeFilters.rating) {
        return false;
      }
      
      // Filtro por texto de búsqueda
      if (activeFilters.searchText) {
        const searchLower = activeFilters.searchText.toLowerCase();
        const nameMatch = ruta.name && ruta.name.toLowerCase().includes(searchLower);
        const descriptionMatch = ruta.description && ruta.description.toLowerCase().includes(searchLower);
        
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredRoutes(filtered);  }, [routes, activeFilters]);
  
  // Función para manejar cambios en los filtros - memoizada para evitar recreaciones
  const handleFilterChange = useCallback((filters) => {
    
    setActiveFilters(prevFilters => {
      // Solo actualizar si realmente hay cambios
      if (JSON.stringify(prevFilters) !== JSON.stringify(filters)) {
        
        return filters;
      }
      
      return prevFilters;
    });
  }, []);

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
        
      </div>

      {/* Componente de filtrado */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Resultados y estadísticas */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold">{filteredRoutes.length}</span> de <span className="font-semibold">{routes.length}</span> rutas
        </p>
        
        {/* Mostrar resumen de los filtros activos */}
        <div className="flex flex-wrap gap-2">
          {activeFilters.landscapes.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activeFilters.landscapes.length} paisajes
            </span>
          )}
          {activeFilters.difficulties.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activeFilters.difficulties.length} dificultades
            </span>
          )}
          {activeFilters.terrains.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activeFilters.terrains.length} terrenos
            </span>
          )}
          {activeFilters.countries.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {activeFilters.countries.length} países
            </span>
          )}
          {activeFilters.rating > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
              {activeFilters.rating}+ estrellas
              <svg className="w-3 h-3 ml-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
          {activeFilters.searchText && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Búsqueda: "{activeFilters.searchText}"
            </span>
          )}
        </div>
      </div>

      {/* Lista de rutas */}
      {routes.length === 0 ? (
        <p className="text-gray-700 text-center py-16">No hay rutas disponibles actualmente.</p>
      ) : filteredRoutes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron rutas</h3>
          <p className="text-gray-600">No hay rutas que coincidan con los filtros seleccionados.</p>          <button 
            onClick={() => setActiveFilters({
              distance: [0, MAX_DISTANCE], // Filtro sin límite superior
              duration: [0, MAX_DURATION], // Filtro sin límite superior
              landscapes: [],
              difficulties: [],
              terrains: [],
              rating: 0,
              countries: [],
              searchText: ''
            })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map(ruta => (
            <RutaCard key={ruta.id} ruta={ruta} />
          ))}
        </div>
      )}
    </div>
  )
}