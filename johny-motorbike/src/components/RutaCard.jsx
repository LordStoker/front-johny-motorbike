import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import defaultRouteImage from '../assets/default-route-image.jpg'
import { useAppContext } from '../context/AppContext'
import StarRating from './StarRating'
import RouteIcon from './RouteIcons'

// Mapa de códigos de país para mostrar banderas
const countryFlags = {
  'Afghanistan': 'af',
  'Albania': 'al',
  'Germany': 'de',
  'Andorra': 'ad',
  'Angola': 'ao',
  'Antigua and Barbuda': 'ag',
  'Saudi Arabia': 'sa',
  'Algeria': 'dz',
  'Argentina': 'ar',
  'Armenia': 'am',
  'Australia': 'au',
  'Austria': 'at',
  'Azerbaijan': 'az',
  'Bahamas': 'bs',
  'Bangladesh': 'bd',
  'Barbados': 'bb',
  'Bahrain': 'bh',
  'Belgium': 'be',
  'Belize': 'bz',
  'Benin': 'bj',
  'Belarus': 'by',
  'Bolivia': 'bo',
  'Bosnia and Herzegovina': 'ba',
  'Botswana': 'bw',
  'Brazil': 'br',
  'Brunei': 'bn',
  'Bulgaria': 'bg',
  'Burkina Faso': 'bf',
  'Burundi': 'bi',
  'Bhutan': 'bt',
  'Cape Verde': 'cv',
  'Cambodia': 'kh',
  'Cameroon': 'cm',
  'Canada': 'ca',
  'Qatar': 'qa',
  'Chad': 'td',
  'Chile': 'cl',
  'China': 'cn',
  'Cyprus': 'cy',
  'Vatican City': 'va',
  'Colombia': 'co',
  'Comoros': 'km',
  'South Korea': 'kr',
  'North Korea': 'kp',
  'Ivory Coast': 'ci',
  'Costa Rica': 'cr',
  'Croatia': 'hr',
  'Cuba': 'cu',
  'Denmark': 'dk',
  'Dominica': 'dm',
  'Ecuador': 'ec',
  'Egypt': 'eg',
  'El Salvador': 'sv',
  'United Arab Emirates': 'ae',
  'Eritrea': 'er',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'Spain': 'es',
  'United States': 'us',
  'Estonia': 'ee',
  'Ethiopia': 'et',
  'Philippines': 'ph',
  'Finland': 'fi',
  'Fiji': 'fj',
  'France': 'fr',
  'Gabon': 'ga',
  'Gambia': 'gm',
  'Georgia': 'ge',
  'Ghana': 'gh',
  'Grenada': 'gd',
  'Greece': 'gr',
  'Guatemala': 'gt',
  'Guinea': 'gn',
  'Equatorial Guinea': 'gq',
  'Guinea-Bissau': 'gw',
  'Guyana': 'gy',
  'Haiti': 'ht',
  'Honduras': 'hn',
  'Hungary': 'hu',
  'India': 'in',
  'Indonesia': 'id',
  'Iraq': 'iq',
  'Iran': 'ir',
  'Ireland': 'ie',
  'Iceland': 'is',
  'Marshall Islands': 'mh',
  'Solomon Islands': 'sb',
  'Israel': 'il',
  'Italy': 'it',
  'Jamaica': 'jm',
  'Japan': 'jp',
  'Jordan': 'jo',
  'Kazakhstan': 'kz',
  'Kenya': 'ke',
  'Kyrgyzstan': 'kg',
  'Kiribati': 'ki',
  'Kuwait': 'kw',
  'Laos': 'la',
  'Lesotho': 'ls',
  'Latvia': 'lv',
  'Lebanon': 'lb',
  'Liberia': 'lr',
  'Libya': 'ly',
  'Liechtenstein': 'li',
  'Lithuania': 'lt',
  'Luxembourg': 'lu',
  'North Macedonia': 'mk',
  'Madagascar': 'mg',
  'Malaysia': 'my',
  'Malawi': 'mw',
  'Maldives': 'mv',
  'Mali': 'ml',
  'Malta': 'mt',
  'Morocco': 'ma',
  'Mauritius': 'mu',
  'Mauritania': 'mr',
  'Mexico': 'mx',
  'Micronesia': 'fm',
  'Moldova': 'md',
  'Monaco': 'mc',
  'Mongolia': 'mn',
  'Montenegro': 'me',
  'Mozambique': 'mz',
  'Myanmar': 'mm',
  'Namibia': 'na',
  'Nauru': 'nr',
  'Nepal': 'np',
  'Nicaragua': 'ni',
  'Niger': 'ne',
  'Nigeria': 'ng',
  'Norway': 'no',
  'New Zealand': 'nz',
  'Oman': 'om',
  'Netherlands': 'nl',
  'Pakistan': 'pk',
  'Palau': 'pw',
  'Palestine': 'ps',
  'Panama': 'pa',
  'Papua New Guinea': 'pg',
  'Paraguay': 'py',
  'Peru': 'pe',
  'Poland': 'pl',
  'Portugal': 'pt',
  'United Kingdom': 'gb',
  'Central African Republic': 'cf',
  'Czech Republic': 'cz',
  'Dominican Republic': 'do',
  'Democratic Republic of the Congo': 'cd',
  'Republic of the Congo': 'cg',
  'Romania': 'ro',
  'Rwanda': 'rw',
  'Russia': 'ru',
  'Samoa': 'ws',
  'Saint Kitts and Nevis': 'kn',
  'San Marino': 'sm',
  'Saint Vincent and the Grenadines': 'vc',
  'Saint Lucia': 'lc',
  'São Tomé and Príncipe': 'st',
  'Senegal': 'sn',
  'Serbia': 'rs',
  'Seychelles': 'sc',
  'Sierra Leone': 'sl',
  'Singapore': 'sg',
  'Syria': 'sy',
  'Somalia': 'so',
  'Sri Lanka': 'lk',
  'Swaziland': 'sz',
  'South Africa': 'za',
  'Sudan': 'sd',
  'South Sudan': 'ss',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Suriname': 'sr',
  'Thailand': 'th',
  'Taiwan': 'tw',
  'Tanzania': 'tz',
  'Tajikistan': 'tj',
  'East Timor': 'tl',
  'Togo': 'tg',
  'Tonga': 'to',
  'Trinidad and Tobago': 'tt',
  'Tunisia': 'tn',
  'Turkmenistan': 'tm',
  'Turkey': 'tr',
  'Tuvalu': 'tv',
  'Ukraine': 'ua',
  'Uganda': 'ug',
  'Uruguay': 'uy',
  'Uzbekistan': 'uz',
  'Vanuatu': 'vu',
  'Vatican City': 'va',
  'Venezuela': 've',
  'Vietnam': 'vn',
  'Yemen': 'ye',
  'Djibouti': 'dj',
  'Zambia': 'zm',
  'Zimbabwe': 'zw'
};

// Función para obtener el código de bandera a partir del nombre del país
const getFlagCode = (countryName) => {
  return countryFlags[countryName] || 'un'; // 'un' es la bandera de Naciones Unidas (por defecto)
};

/**
 * Componente para mostrar una tarjeta de ruta
 * @param {Object} props 
 * @param {Object} props.ruta - Datos de la ruta
 * @param {string} props.className - Clases adicionales para estilizar el contenedor
 */
const RutaCard = ({ ruta, className = '' }) => {
  const { user, checkFavorite, toggleFavorite, favoriteRouteIds, countries } = useAppContext();  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  // Obtener el país de la ruta, considerando diferentes estructuras de datos
  const countryInfo = useMemo(() => {
    // Si ya tenemos el objeto country completo
    if (typeof ruta.country === 'object' && ruta.country?.name) {
      return ruta.country;
    }
    
    // Si tenemos el país como string
    if (typeof ruta.country === 'string') {
      return { name: ruta.country };
    }
    
    // Si tenemos country_id o country_name
    if (ruta.country_id && countries.length > 0) {
      const foundCountry = countries.find(c => c.id === ruta.country_id);
      return foundCountry || null;
    } else if (ruta.country_name) {
      return { name: ruta.country_name };
    }
    
    return null;
  }, [ruta, countries]);
  // Estados para manejar el modal de login
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Maneja la animación de entrada y salida del modal
  const openModal = () => {
    setShowLoginModal(true);
    setIsClosing(false);
    setTimeout(() => setModalVisible(true), 10); // Espera para activar la animación de entrada
  };
  
  const closeModal = () => {
    setIsClosing(true);
    setModalVisible(false);
    setTimeout(() => {
      setShowLoginModal(false);
      setIsClosing(false);
    }, 300);
  };
  
  // Verificar si la ruta es favorita al cargar el componente - versión altamente optimizada
  useEffect(() => {
    let isMounted = true; // Bandera para evitar actualizar el estado si el componente se desmonta
    
    const checkIfFavorite = async () => {
      if (user && ruta?.id) {
        // Evitamos cualquier renderización innecesaria precargando el estado
        // desde favoriteRouteIds que ya obtuvimos del contexto
        const parsedRouteId = parseInt(ruta.id);
        
        // Verificación local instantánea sin esperar al servidor
        if (favoriteRouteIds.has(parsedRouteId)) {
          if (isMounted) setIsFavorite(true);
          return; // Si ya sabemos que es favorita, no necesitamos consultar el servidor
        }
        
        // Si no sabemos con certeza, consultamos el servidor
        // pero solo si es necesario (el componente sigue montado)
        const favorite = await checkFavorite(ruta.id);
        if (isMounted) setIsFavorite(favorite);
      }
    };
    
    checkIfFavorite();
    
    // Limpieza para evitar memory leaks y actualizaciones después del desmontaje
    return () => {
      isMounted = false;
    };
  }, [user, ruta?.id, checkFavorite, favoriteRouteIds]);
    // Estado para manejar la animación del corazón
  const [heartKey, setHeartKey] = useState(0); // Clave para forzar una nueva animación  // Función para manejar el clic en el botón de favorito - versión optimizada
  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Evitar que el enlace de la tarjeta se active
    e.stopPropagation();
    
    // Si el usuario no está logueado, mostramos el modal de login
    if (!user) {
      openModal();
      return;
    }
    
    // Actualizamos la UI inmediatamente sin esperar la respuesta del servidor
    setIsFavorite(!isFavorite); // Cambiamos el estado visual inmediatamente
    setHeartKey(prevKey => prevKey + 1); // Actualizamos la clave para forzar una nueva animación
    
    // El spinner solo se mostrará brevemente para indicar que la acción está en proceso
    // pero el cambio visual del corazón ya ocurrió
    setIsLoading(true);
    
    // Hacemos la petición a la API en segundo plano
    toggleFavorite(ruta.id)
      .then(result => {
        // Solo si el resultado difiere de nuestra actualización optimista, lo corregimos
        if (result !== !isFavorite) {
          setIsFavorite(result);
        }
      })
      .catch(error => {
        console.error('Error al cambiar estado de favorito:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  // Si no hay datos de la ruta, no mostrar nada
  if (!ruta) {
    return null;
  }
  // Imagen de la ruta o imagen por defecto
  let routeImage;
    // Si es auto_generated_map, generamos URL de la imagen estática de Geoapify
  if (ruta.image === 'auto_generated_map' && ruta.route_map && import.meta.env.VITE_GEOAPIFY_API_KEY) {
    try {
      // console.log('Generando imagen de mapa para ruta con ID:', ruta.id);
      
      // Parsear las coordenadas de la ruta
      let coordinates = [];
      try {
        // Primero intentamos parsear como JSON si es una cadena
        if (typeof ruta.route_map === 'string') {
          coordinates = JSON.parse(ruta.route_map);
        } 
        // Si es un array, lo usamos directamente
        else if (Array.isArray(ruta.route_map)) {
          coordinates = ruta.route_map;
        }
        
        // console.log('Coordenadas parseadas:', coordinates.length);
      } catch (parseError) {
        console.error('Error al parsear coordenadas:', parseError);
        coordinates = [];
      }
      
      if (Array.isArray(coordinates) && coordinates.length >= 2) {
        // Calcular centro y límites
        const bounds = coordinates.reduce((acc, coord) => {
          // Asegurarse de que las coordenadas son números válidos
          const lat = parseFloat(coord[0]);
          const lng = parseFloat(coord[1]);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            return {
              minLat: Math.min(acc.minLat, lat),
              maxLat: Math.max(acc.maxLat, lat),
              minLng: Math.min(acc.minLng, lng),
              maxLng: Math.max(acc.maxLng, lng)
            };
          }
          return acc;
        }, {
          minLat: parseFloat(coordinates[0][0]),
          maxLat: parseFloat(coordinates[0][0]),
          minLng: parseFloat(coordinates[0][1]),
          maxLng: parseFloat(coordinates[0][1])
        });
        
        // Calcular centro
        const centerLat = (bounds.minLat + bounds.maxLat) / 2;
        const centerLng = (bounds.minLng + bounds.maxLng) / 2;
        
        // Calcular zoom basado en los límites
        const latDiff = bounds.maxLat - bounds.minLat;
        const lngDiff = bounds.maxLng - bounds.minLng;
        const maxDiff = Math.max(latDiff, lngDiff);
        let zoom = 13; // Zoom predeterminado
        
        // Ajustar zoom según la distancia
        if (maxDiff > 0.5) zoom = 10;
        if (maxDiff > 1) zoom = 9;
        if (maxDiff > 2) zoom = 8;
        if (maxDiff > 4) zoom = 7;
        if (maxDiff > 8) zoom = 6;
        
        // Crear URL de Geoapify
        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
        const geoapifyBaseUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${centerLng},${centerLat}&zoom=${zoom}&apiKey=${apiKey}`;
        
        // Añadir marcadores (inicio y fin)
        const firstPoint = coordinates[0];
        const lastPoint = coordinates[coordinates.length - 1];
        const markersParam = `&marker=lonlat:${firstPoint[1]},${firstPoint[0]};type:awesome;color:%23ff0000;size:medium|lonlat:${lastPoint[1]},${lastPoint[0]};type:awesome;color:%230000ff;size:medium`;
        
        // Añadir línea de ruta - Limitar puntos para evitar URLs demasiado largas
        const pathPoints = coordinates.length > 50 
          ? coordinates.filter((_, idx) => idx % Math.max(1, Math.floor(coordinates.length / 50)) === 0)
          : coordinates;
          
        const pathParam = `&polyline=width:3;color:%23ff0000;opacity:0.9;${pathPoints.map(p => `${p[1]},${p[0]}`).join(',')}`;
        
        // URL completa
        routeImage = geoapifyBaseUrl + markersParam + pathParam;
        
      } else {
        console.warn('La ruta no tiene suficientes coordenadas válidas');
        routeImage = defaultRouteImage;
      }
    } catch (e) {
      console.error('Error al generar imagen de mapa:', e);
      routeImage = defaultRouteImage;
    }  } else if (ruta.image) {
    // Si no es auto_generated_map, verificar si es una URL externa, un dato data URI o una imagen almacenada
    if (ruta.image.startsWith('http://') || ruta.image.startsWith('https://')) {
      // URL externa directa
      routeImage = ruta.image;
    } else if (ruta.image.startsWith('data:')) {
      // Data URI
      routeImage = ruta.image;
    } else {
      // Imagen almacenada en el servidor
      routeImage = `${import.meta.env.VITE_API_URL}/storage/${ruta.image}`;
    }
    
    console.log('Usando imagen normal:', ruta.image.substring(0, 30) + '...');
  } else {
    // Si no hay imagen, usar imagen de galería o la imagen por defecto
    routeImage = (ruta.route_images && ruta.route_images[0])
      ? `${import.meta.env.VITE_API_URL}/storage/${ruta.route_images[0].url}`
      : defaultRouteImage;
      
    
  }
  
  return (    <div className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col ${className}`}>     
     {/* Imagen de la ruta */}      
     <div className="relative w-full h-48 overflow-hidden">
        <Link to={`/rutas/${ruta.id}`} className="block w-full h-full">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">Error al cargar la imagen</p>
            </div>
          )}
          <img 
            src={routeImage}
            alt={ruta.name}
            className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        </Link>
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute top-3 right-3 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-sm transition-all active:scale-90 hover:shadow-md transform hover:-translate-y-0.5"
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >{isLoading ? (
            <svg 
              className="animate-spin h-5 w-5 text-blue-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (            <svg 
              xmlns="http://www.w3.org/2000/svg"
              key={heartKey} // Usando la clave para forzar una nueva animación
              className={`h-5 w-5 ${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-all duration-100 ${isFavorite ? 'animate-[pulse_0.3s_ease-in-out_1]' : 'hover:scale-110 hover:text-red-400'}`} 
              fill={isFavorite ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                className={isFavorite ? "animate-heartbeat" : ""}
              />
            </svg>
          )}
        </button>
      </div>
      
      {/* Contenido de la tarjeta */}      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/rutas/${ruta.id}`} className="hover:text-blue-700">
          <h2 className="text-xl font-bold text-blue-800 mb-2 hover:underline">{ruta.name}</h2>
        </Link>
        <p className="text-gray-700 mb-3 line-clamp-2">
          {ruta.description}
        </p>
          {/* Metadatos de la ruta */}
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 mb-3 gap-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{ruta.distance} km</span>
          </div>
            <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.floor(ruta.duration)} min</span>
          </div>
            <span className={`px-2 py-1 rounded-full flex items-center ${
            ruta.difficulty?.name === 'Fácil' ? 'bg-green-100 text-green-800' :
            ruta.difficulty?.name === 'Moderada' ? 'bg-yellow-100 text-yellow-800' :
            ruta.difficulty?.name === 'Difícil' ? 'bg-red-100 text-red-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            <RouteIcon 
              type="difficulty"
              name={ruta.difficulty?.name || 'No especificada'}
              size="sm"
              className="mr-1"
            />
            <span>{ruta.difficulty?.name || 'No especificada'}</span>
          </span>
        </div>
        
        {/* Comentarios y valoraciones */}
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          {/* Contador de comentarios */}
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{ruta.comments_count || 0}</span>
          </div>          {/* Valoración media con estrellas */}
          <StarRating 
            rating={ruta.totalScore && ruta.countScore ? ruta.totalScore / ruta.countScore : 0} 
            size="sm"
            showValue={true}
            className="hover:opacity-80 transition-opacity"
          />
        </div>        {/* Iconos de terreno y paisaje */}
        <div className="flex flex-wrap gap-3 mb-4">          {ruta.terrain && (
            <RouteIcon 
              type="terrain"
              name={ruta.terrain.name}
              size="md"
            />
          )}
          {ruta.landscape && (
            <RouteIcon 
              type="landscape"
              name={ruta.landscape.name}
              size="md"
            />
          )}
        </div>        {/* Mostrar el país */}
        {countryInfo && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            {countryInfo.name && (
              <img 
                src={`https://flagcdn.com/16x12/${getFlagCode(countryInfo.name)}.png`}
                alt={`Bandera de ${countryInfo.name}`}
                className="h-3 w-4 mr-1 object-cover"
              />
            )}
            <span>
              {countryInfo.name || 'País no especificado'}
            </span>
          </div>
        )}

        {/* Mostrar creador de la ruta */}
        {ruta.user && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <Link 
              to={`/usuarios/${ruta.user.id}`} 
              className="hover:text-blue-700 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {ruta.user.name} {ruta.user.last_name || ''}
            </Link>
          </div>        )}
      </div>
      
      {/* Estilos para animaciones avanzadas */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes heartbeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-heartbeat {
            animation: heartbeat 0.5s ease-in-out;
          }
          
          @keyframes modalOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
          .animate-modal-out {
            animation: modalOut 0.2s ease-out forwards;
          }
        `
      }} />
      
      {/* Modal de inicio de sesión */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${modalVisible ? 'opacity-50' : 'opacity-0'}`}></div>
          <div className={`bg-white rounded-lg shadow-xl overflow-hidden w-11/12 max-w-md mx-auto transform transition-all duration-300 ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${isClosing ? 'animate-modal-out' : ''}`}>
            <div className="relative p-6">
              <button 
                onClick={closeModal} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Necesitas iniciar sesión</h3>
              <p className="text-gray-600 mb-6">
                Para añadir rutas a favoritos necesitas iniciar sesión con tu cuenta. 
                Si aún no tienes una cuenta, puedes registrarte.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RutaCard