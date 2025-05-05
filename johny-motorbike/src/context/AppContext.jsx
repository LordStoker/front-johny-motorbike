import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

// URL base de la API
const API_URL = 'http://johny-motorbike.test/api'

// Creación del contexto
export const AppContext = createContext()

// Hook personalizado para usar el contexto
export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  // Estado para almacenar todos los datos de la API
  const [routes, setRoutes] = useState([])
  const [difficulties, setDifficulties] = useState([])
  const [landscapes, setLandscapes] = useState([])
  const [terrains, setTerrains] = useState([])
  const [comments, setComments] = useState([])
  const [commentImages, setCommentImages] = useState([])
  const [countries, setCountries] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para cargar todos los datos iniciales
  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Realizar todas las peticiones en paralelo para optimizar la carga
      const [
        routesRes, 
        difficultiesRes, 
        landscapesRes, 
        terrainsRes, 
        commentsRes,
        commentImagesRes,
        countriesRes,
        rolesRes
      ] = await Promise.all([
        axios.get(`${API_URL}/route`),
        axios.get(`${API_URL}/difficulty`),
        axios.get(`${API_URL}/landscape`),
        axios.get(`${API_URL}/terrain`),
        axios.get(`${API_URL}/comment`),
        axios.get(`${API_URL}/comment-images`),
        axios.get(`${API_URL}/country`),
        axios.get(`${API_URL}/role`)
      ])

      // Actualizar el estado con los datos recibidos
      setRoutes(routesRes.data.data || [])
      setDifficulties(difficultiesRes.data.data || [])
      setLandscapes(landscapesRes.data.data || [])
      setTerrains(terrainsRes.data.data || [])
      setComments(commentsRes.data.data || [])
      setCommentImages(commentImagesRes.data.data || [])
      setCountries(countriesRes.data.data || [])
      setRoles(rolesRes.data.data || [])
      //console.log(routesRes.data.data)      
    } catch (err) {
      console.error('Error cargando datos iniciales:', err)
      setError('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  // Función para recargar un recurso específico
  const reloadResource = async (resource) => {
    try {
      const response = await axios.get(`${API_URL}/${resource}`)
      
      // Actualizar el estado correspondiente según el recurso
      switch (resource) {
        case 'route':
          setRoutes(response.data.data || [])
          break
        case 'difficulty':
          setDifficulties(response.data.data || [])
          break
        case 'landscape':
          setLandscapes(response.data.data || [])
          break
        case 'terrain':
          setTerrains(response.data.data || [])
          break
        case 'comment':
          setComments(response.data.data || [])
          break
        case 'comment-images':
          setCommentImages(response.data.data || [])
          break
        case 'country':
          setCountries(response.data.data || [])
          break
        case 'role':
          setRoles(response.data.data || [])
          break
        default:
          break
      }
      return true
    } catch (err) {
      console.error(`Error recargando ${resource}:`, err)
      return false
    }
  }

  // Cargar datos iniciales cuando el componente se monta
  useEffect(() => {
    loadInitialData()
  }, [])

  // Valores a compartir en el contexto
  const contextValue = {
    routes,
    difficulties,
    landscapes,
    terrains,
    comments,
    commentImages,
    countries,
    roles,
    loading,
    error,
    reloadResource,
    loadInitialData
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}