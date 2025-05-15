import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react'
import axios from 'axios'

// URL base de la API
const API_URL = 'http://johny-motorbike.test/api'

// Creación del contexto
export const AppContext = createContext()

// Hook personalizado para usar el contexto
export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {  // Estado para almacenar todos los datos de la API
  const [routes, setRoutes] = useState([])
  const [difficulties, setDifficulties] = useState([])
  const [landscapes, setLandscapes] = useState([])
  const [terrains, setTerrains] = useState([])
  const [comments, setComments] = useState([])
  const [commentImages, setCommentImages] = useState([])
  const [countries, setCountries] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)  // Estado para las rutas favoritas
  const [favoriteRoutes, setFavoriteRoutes] = useState([])
  const [favoriteRouteIds, setFavoriteRouteIds] = useState(new Set()) // Set para búsqueda O(1)
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  
  // --- NOTIFICACIONES ---
  const [notification, setNotification] = useState(null)
  
  // Función para mostrar una notificación
  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type, id: Date.now() })
    
    // Eliminar la notificación después del tiempo especificado
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

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
        
        // Precargamos los favoritos inmediatamente para mejorar la UX
        loadFavoriteRouteIds();
        
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

  // Actualizar datos del perfil del usuario
  const updateProfile = async (userId, data) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Asegurar que tenemos el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthError('No estás autenticado');
        return false;
      }

      // Llamar a la API para actualizar los datos del usuario
      const res = await axios.put(
        `${API_URL}/user/${userId}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (res.data && res.data.success) {
        // Actualizar el usuario en el estado y localStorage
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      } else {
        setAuthError('Error al actualizar el perfil');
        return false;
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setAuthError(
        err.response?.data?.message || 
        'Error al actualizar el perfil. Verifica tus datos.'
      );
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Cambiar contraseña (estando autenticado)
  const changePassword = async (current_password, password, password_confirmation) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Asegurar que tenemos el token de autenticación
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setAuthError('No estás autenticado');
        return false;
      }

      // Llamar a la API para cambiar la contraseña
      const res = await axios.put(
        `${API_URL}/user/${user.id}/change-password`,
        {
          current_password,
          password,
          password_confirmation
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (res.data && res.data.success) {
        return true;
      } else {
        setAuthError('Error al cambiar la contraseña');
        return false;
      }
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setAuthError(
        err.response?.data?.message || 
        'Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.'
      );
      return false;
    } finally {
      setAuthLoading(false);
    }
  };
  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    // Limpiamos también los datos de favoritos
    setFavoriteRoutes([])
    setFavoriteRouteIds(new Set())
  }

  // Mantener sesión si hay token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
    }
  }, [])
  // --- FAVORITOS ---
  
  // Declaramos loadFavoriteRouteIds primero, antes de checkFavorite
  // Función más ligera para cargar solo los IDs de rutas favoritas
  const loadFavoriteRouteIds = useCallback(async () => {
    if (!user) {
      setFavoriteRouteIds(new Set());
      return Promise.resolve();
    }
    
    // Si ya tenemos rutas favoritas cargadas, usamos esos IDs sin hacer otra petición
    if (favoriteRoutes.length > 0) {
      const idsFromRoutes = new Set(favoriteRoutes.map(route => parseInt(route.id)));
      setFavoriteRouteIds(idsFromRoutes);
      return Promise.resolve(idsFromRoutes);
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setFavoriteRouteIds(new Set());
        return Promise.resolve();
      }
      
      // Usando AbortController para evitar peticiones colgadas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // timeout más corto para esta petición ligera
      
      // Obtener solo los IDs de las rutas favoritas
      const res = await axios.get(`${API_URL}/favorite-route-ids`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (res.data.success && res.data.data) {
        // Actualizar el Set de IDs
        const newIds = new Set(res.data.data.map(id => parseInt(id)));
        setFavoriteRouteIds(newIds);
        return Promise.resolve(newIds);
      } else {
        setFavoriteRouteIds(new Set());
        return Promise.resolve(new Set());
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('La petición de IDs de favoritos fue cancelada por timeout');
      } else {
        console.error('Error al cargar IDs de favoritos:', err);
      }
      setFavoriteRouteIds(new Set());
      return Promise.resolve(new Set());
    }
  }, [user, favoriteRoutes]);
  
  // Verificar si una ruta es favorita - versión altamente optimizada que prioriza el cache local
  const checkFavorite = useCallback(async (routeId) => {
    if (!user) return false;
    
    const parsedRouteId = parseInt(routeId);
    
    // Caso 1: Si tenemos el ID en el Set local, devolvemos true inmediatamente sin petición al servidor
    if (favoriteRouteIds.has(parsedRouteId)) {
      return true;
    }
    
    // Caso 2: Si el Set de favoritos está inicializado pero no contiene este ID, sabemos que no es favorito
    // Solo hacemos esto si creemos que el Set está en un estado confiable
    if (favoriteRouteIds.size > 0 || favoriteRoutes.length > 0) {
      // Si ya cargamos favoritos y este ID no está, probablemente no sea favorito
      // Esto evita llamadas innecesarias al API
      return false;
    }
    
    // Caso 3: Si el Set está vacío pero tenemos rutas favoritas, inicializamos el Set
    if (favoriteRouteIds.size === 0 && favoriteRoutes.length > 0) {
      const newFavoriteIds = new Set(favoriteRoutes.map(route => parseInt(route.id)));
      setFavoriteRouteIds(newFavoriteIds);
      return newFavoriteIds.has(parsedRouteId);
    }
    
    // Caso 4: Como último recurso, consultamos al servidor sólo si es la primera carga
    try {
      // Si estamos aquí, es porque no tenemos datos locales confiables,
      // así que intentamos cargar todos los IDs favoritos de una vez
      // para evitar múltiples peticiones individuales
      
      // En lugar de consultar una ruta específica, cargamos todos los IDs
      await loadFavoriteRouteIds();
      
      // Ahora verificamos en el Set actualizado
      return favoriteRouteIds.has(parsedRouteId);
    } catch (err) {
      console.error('Error al verificar favorito:', err);
      return false;
    }
  }, [user, favoriteRouteIds, favoriteRoutes, loadFavoriteRouteIds]);
  
  // Alternar una ruta como favorita (añadir/quitar)
  const toggleFavorite = async (routeId) => {
    if (!user) return false;
    
    const parsedRouteId = parseInt(routeId);
    const isFav = favoriteRouteIds.has(parsedRouteId);
    
    // Primero actualizamos el Set local para un cambio visual inmediato
    // (esto se revierte si la petición falla)
    const newFavoriteIds = new Set(favoriteRouteIds);
    if (isFav) {
      newFavoriteIds.delete(parsedRouteId);
    } else {
      newFavoriteIds.add(parsedRouteId);
    }
    setFavoriteRouteIds(newFavoriteIds);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Revertir cambio local si no hay token
        setFavoriteRouteIds(favoriteRouteIds);
        return false;
      }

      // Optimizamos para usar AbortController si se cancela la petición
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout de 8 segundos
      
      const res = await axios.post(`${API_URL}/routes/${routeId}/favorite`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);      if (res.data.success) {
        // Ya actualizamos el Set local de IDs antes de la petición,
        // ahora solo necesitamos actualizar la lista de rutas favoritas
        
        if (!res.data.is_favorite) {
          // Si se quitó de favoritos, filtramos la ruta de la lista completa
          setFavoriteRoutes(prevFavorites => prevFavorites.filter(route => route.id !== parsedRouteId));
        } else {
          // Si se agregó a favoritos, obtenemos los datos completos de la ruta
          // y la añadimos a la lista (en segundo plano)
          axios.get(`${API_URL}/route/${routeId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(route => {
            if (route.data.success && route.data.data) {
              setFavoriteRoutes(prevFavorites => [...prevFavorites, route.data.data]);
            }
          }).catch(() => {
            // En caso de error, intentamos recargar todas las rutas favoritas
            loadFavoriteRoutes();
          });
        }
        return res.data.is_favorite;
      }
      return false;    } catch (err) {
      // En caso de error, revertimos el cambio en el Set local
      setFavoriteRouteIds(favoriteRouteIds);
      
      if (err.name === 'AbortError') {
        console.error('La petición de favorito fue cancelada por timeout');
      } else {
        console.error('Error al cambiar favorito:', err);
      }
      return isFav; // Devolvemos el estado original
    }
  };  // Cargar las rutas favoritas del usuario
  // Usamos useCallback para evitar que la función se recree en cada renderización
  // Retornamos la promesa para poder encadenar acciones
  const loadFavoriteRoutes = useCallback(async () => {
    if (!user) {
      setFavoriteRoutes([]);
      return Promise.resolve(); // Devolvemos una promesa resuelta
    }
    
    try {
      setLoadingFavorites(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setFavoriteRoutes([]);
        return Promise.resolve();
      }
      
      // Usamos AbortController para manejar timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de timeout
      
      // Usar la ruta específica sin necesidad de depuración
      const res = await axios.get(`${API_URL}/user-favorite-routes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
      
      // Limpiamos el timeout ya que la petición terminó
      clearTimeout(timeoutId);
          if (res.data.success) {
        const favoriteData = res.data.data || [];
        setFavoriteRoutes(favoriteData);
        
        // Actualizamos el Set de IDs de rutas favoritas
        const favoriteIds = new Set(favoriteData.map(route => route.id));
        setFavoriteRouteIds(favoriteIds);
      } else {
        setFavoriteRoutes([]);
        setFavoriteRouteIds(new Set());
      }
      
      return Promise.resolve(res.data.success ? res.data.data : []);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('La petición de favoritos fue cancelada por timeout');
      } else {
        console.error('Error al cargar rutas favoritas:', err);
      }
      setFavoriteRoutes([]);
      return Promise.resolve([]);
    } finally {
      setLoadingFavorites(false);
    }  }, [user]); // Solo se recrea cuando user cambia
    // Efecto para cargar las rutas favoritas cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      // Primero cargamos solo los IDs (más rápido) para respuesta inmediata
      loadFavoriteRouteIds()
        .then(() => {
          // Luego, en segundo plano, cargamos los datos completos
          // pero con menor prioridad para no bloquear la UI
          setTimeout(() => {
            loadFavoriteRoutes();
          }, 100);
        });
    } else {
      setFavoriteRoutes([]);
      setFavoriteRouteIds(new Set());
    }
  }, [user]);
  // Variable para controlar el tiempo de la última carga de favoritos
  const lastFavoritesCheck = useRef(0);
  
  // Función para verificar si es necesario recargar los favoritos
  const shouldRefreshFavorites = () => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastFavoritesCheck.current;
    // Si han pasado más de 5 minutos desde la última verificación
    return timeSinceLastCheck > 5 * 60 * 1000;
  };
  
  // Función para cargar todos los datos iniciales
  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Si el usuario está logueado y ha pasado tiempo suficiente, actualizamos favoritos
      if (user && shouldRefreshFavorites()) {
        loadFavoriteRouteIds();
        lastFavoritesCheck.current = Date.now();
      }
      
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
    sendPasswordResetLink,
    resetPassword,
    updateProfile,
    changePassword,
    logout,    favoriteRoutes,
    loadingFavorites,
    checkFavorite,
    toggleFavorite,
    loadFavoriteRoutes,
    loadFavoriteRouteIds,
    favoriteRouteIds,
    notification,
    showNotification
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}