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

  // --- AUTENTICACIÓN ---
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  // Login
  const login = async (email, password) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password })
      if (res.data && res.data.user && res.data.access_token) {
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.access_token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
        return true
      } else {
        setAuthError('Respuesta inesperada del servidor')
        return false
      }
    } catch (err) {
      setAuthError(
        err.response?.data?.message || 'Error al iniciar sesión. Verifica tus datos.'
      )
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  // Register
  const register = async (name, last_name, email, password, password_confirmation) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name, last_name, email, password, password_confirmation
      })
      if (res.data && res.data.user && res.data.access_token) {
        setUser(res.data.user)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.access_token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
        return true
      } else {
        setAuthError('Respuesta inesperada del servidor')
        return false
      }
    } catch (err) {
      setAuthError(
        err.response?.data?.message || 'Error al registrarse. Verifica tus datos.'
      )
      return false
    } finally {
      setAuthLoading(false)
    }
  }

  // Solicitar enlace para recuperar contraseña
  const sendPasswordResetLink = async (email) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      // Usamos la ruta de API para recuperación de contraseña
      const res = await axios.post(`${API_URL}/forgot-password`, 
        { email },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      if (res.data && res.data.status === 'success') {
        return true;
      } else {
        // No mostramos error específico para evitar revelar si el email existe en la BD
        return true;
      }
    } catch (err) {
      // Es importante no revelar si el correo existe o no, por seguridad
      console.error('Error en solicitud de recuperación:', err);
      console.error('Detalles del error:', err.response?.data); // Capturamos detalles del error
      
      if (err.response?.status === 429) {
        setAuthError('Demasiadas solicitudes. Inténtalo de nuevo más tarde.');
        return false;
      }
      
      // Si hay un error específico, lo mostramos (temporal para depuración)
      if (err.response?.status === 400) {
        setAuthError(err.response?.data?.message || 'Error en la solicitud. Revisa los datos e intenta de nuevo.');
        return false;
      }
      
      // No mostrar otros errores, fingir que todo fue bien para no revelar información
      return true;
    } finally {
      setAuthLoading(false);
    }
  }

  // Restablecer contraseña
  const resetPassword = async (email, password, password_confirmation, token) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Usamos la ruta de API para reset de contraseña
      const res = await axios.post(`${API_URL}/reset-password`, 
        {
          email,
          password,
          password_confirmation,
          token
        },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      if (res.data && res.data.status === 'success') {
        return true;
      } else {
        setAuthError('No se pudo restablecer la contraseña. Inténtalo de nuevo.');
        return false;
      }
    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
            
      setAuthError(
        err.response?.data?.message || 
        'Error al restablecer la contraseña. El enlace podría haber expirado.'
      );
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  // Mantener sesión si hay token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Opcional: podrías validar el token con un endpoint /me
    }
  }, [])

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
    loadInitialData,
    user,
    authError,
    authLoading,
    login,
    register,
    sendPasswordResetLink, // Nueva función
    resetPassword,         // Nueva función
    logout,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}