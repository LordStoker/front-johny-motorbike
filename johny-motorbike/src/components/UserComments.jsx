import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StarRating from './StarRating';

/**
 * Componente para mostrar los comentarios realizados por un usuario
 * @param {Object} props
 * @param {number} props.userId - ID del usuario
 * @param {boolean} props.isPublic - Indica si estamos en un perfil público o personal
 */
const UserComments = ({ userId, isPublic = false }) => {
  const { getUserComments } = useAppContext();
    // Estados para los comentarios
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [error, setError] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  
  // Usar useRef para rastrear el estado de carga sin provocar rerenderizaciones
  const loadingRef = useRef(false);

  /**
   * Formatear fecha a formato legible
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} - Fecha formateada
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };  /**
   * Cargar comentarios del usuario
   * Definimos la función fuera de los hooks para evitar problemas de recreación en cada render
   */
  const fetchUserComments = async (pageToLoad = 1) => {
    // Si ya estamos cargando o no hay ID, salimos
    if (loadingRef.current || !userId) return;

    // Establecer estado de carga
    loadingRef.current = true;
    setIsLoadingComments(true);
    setError(null);
    
    try {
      // Manejo seguro de la llamada a API
      let response;
      try {
        response = await getUserComments(userId, pageToLoad, 5); // 5 comentarios por página
      } catch (requestError) {
        console.error('Error en la petición de comentarios');
        response = {
          success: false,
          data: [],
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 5,
            total: 0
          },
          error: requestError.message
        };
      }
      
      if (response && response.success) {
        // Procesamos datos
        const commentsData = response.data || [];
        const pagination = response.pagination || {};
        
        // Actualizamos comentarios
        if (pageToLoad === 1) {
          setComments(commentsData);
        } else {
          setComments(prev => [...prev, ...commentsData]);
        }
        
        // Actualizamos paginación
        const currentPage = pagination.current_page || 1;
        const lastPage = pagination.last_page || 1;
        const total = pagination.total || 0;
        
        setHasMoreComments(currentPage < lastPage);
        setCurrentPage(currentPage);
        setTotalComments(total);
      } else {
        setError('No se pudieron cargar los comentarios');
        
        if (pageToLoad === 1) {
          setComments([]);
        }
        setHasMoreComments(false);
        setCurrentPage(1);
        setTotalComments(0);
      }
    } catch (err) {
      console.error('Error al cargar comentarios');
      setError('Error al cargar los comentarios. Por favor, inténtalo de nuevo.');
      
      if (pageToLoad === 1) {
        setComments([]);
      }
      setHasMoreComments(false);
      setCurrentPage(1);
      setTotalComments(0);
    } finally {
      loadingRef.current = false;
      setIsLoadingComments(false);
    }
  };

  // Memoizamos una función simple que solo llama a la función principal
  // Esto evita recreaciones innecesarias y bucles infinitos
  const loadComments = useCallback((page = 1) => {
    fetchUserComments(page);
  }, [userId]); // Solo depende del userId  // Cargar comentarios al montar el componente o cuando cambie el userId
  useEffect(() => {
    let isComponentMounted = true;
    
    if (userId && isComponentMounted) {
      setComments([]); // Limpiar comentarios anteriores
      setCurrentPage(1);
      setHasMoreComments(true);
      loadingRef.current = false; // Reiniciar el estado de carga
      
      // Llamamos directamente a la función sin depender de loadComments
      fetchUserComments(1);
    }
    
    // Cleanup function para evitar actualizaciones en componentes desmontados
    return () => {
      isComponentMounted = false; 
      loadingRef.current = true; // Prevenir cualquier carga pendiente
    };
  }, [userId]); // Solo depende de userId// Función para cargar más comentarios - simplificada
  const handleLoadMore = () => {
    // Verificamos hasMoreComments sin depender del estado de carga
    if (hasMoreComments) {
      fetchUserComments(currentPage + 1);
    }
  };
  // Envolver el renderizado en un try/catch para capturar errores
  try {
    return (      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isPublic ? 'Comentarios' : 'Mis Comentarios'} ({totalComments})
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block">{error}</span>
          </div>
        )}        {isLoadingComments && comments.length === 0 && !error && (
        <div className="flex justify-center items-center py-6">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {(!comments || comments.length === 0) && !isLoadingComments && !error ? (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>          <p className="text-gray-500 italic">
            {isPublic 
              ? 'Este usuario aún no ha realizado ningún comentario.' 
              : 'Aún no has realizado ningún comentario.'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {isPublic 
              ? 'Cuando el usuario comente en rutas, aparecerán aquí.'
              : 'Cuando comentes en rutas, aparecerán aquí.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {comments && comments.length > 0 && comments.map((comment) => {
            // Verificamos si el comentario es válido
            if (!comment || !comment.id) return null;
            
            return (
              <li key={comment.id} className="border-b border-gray-200 pb-4 mb-4 last:border-0 hover:bg-gray-50 rounded-md p-3 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="w-full">                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <StarRating rating={comment.score || 0} size="md" />
                        <span className="ml-2 text-gray-600 text-sm">
                          {comment.created_at ? formatDate(comment.created_at) : 'Fecha desconocida'}
                        </span>
                      </div>
                    </div>
                    {comment.route ? (
                      <div className="mb-3">
                        <p className="text-gray-600 font-medium">Ruta del comentario </p>
                        <Link 
                          to={`/rutas/${comment.route.id}`} 
                          className="text-blue-700 font-medium hover:underline inline-block"
                        >
                          {comment.route.name || 'Ruta sin nombre'}
                        </Link>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic mb-3">Ruta no disponible</p>
                    )}
                    <p className="text-gray-600 font-medium">Comentario </p>
                    <p className="text-gray-700">{comment.comment || 'Sin comentario'}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
        {hasMoreComments && comments && comments.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingComments}
            className={`px-6 py-2 border border-blue-500 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors flex items-center ${
              isLoadingComments ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoadingComments ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Cargar más comentarios
              </>
            )}
          </button>
        </div>
      )}
      
      {!hasMoreComments && comments && comments.length > 0 && (
        <div className="text-center text-gray-500 mt-6 pt-2 border-t border-gray-200">
          No hay más comentarios para mostrar
        </div>      )}
      </div>
    );
  } catch (renderError) {    // Reducimos detalle del log para evitar saturación
    console.error('Error en renderizado de componente');
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isPublic ? 'Comentarios' : 'Mis Comentarios'}
        </h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block font-bold">Error al cargar comentarios</span>
          <span className="block">Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.</span>
        </div>
      </div>
    );
  }
};

export default UserComments;
