import { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css'; // Importamos nuestros estilos personalizados
import axios from 'axios';

// Corrige el problema de los iconos de marcadores que no se muestran en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente para centrar el mapa en la ruta
function FitBounds({ routeCoordinates, onMapReady }) {
  const map = useMap();
  // Referencia para llevar control de si el usuario ya interactuó con el mapa
  const userInteracted = useRef(false);
  // Referencia para controlar cuando fue la última vez que se hizo fitBounds
  const lastFitBoundsRef = useRef(0);
  // Referencia para llevar el último conteo de coordenadas
  const lastCoordCountRef = useRef(0);
  
  // Manejador de eventos para detectar interacción del usuario con el mapa
  useEffect(() => {
    const detectUserInteraction = () => {
      userInteracted.current = true;
    };
    
    // Eventos que indican interacción del usuario con el mapa
    map.on('dragstart', detectUserInteraction);
    map.on('zoomstart', detectUserInteraction);
    
    return () => {
      map.off('dragstart', detectUserInteraction);
      map.off('zoomstart', detectUserInteraction);
    };
  }, [map]);
  
  useEffect(() => {
    // Detectar si debemos ajustar la vista según condiciones específicas
    const shouldFitBounds = () => {
      const now = Date.now();
      const timeSinceLastFit = now - lastFitBoundsRef.current;
      
      // Casos para ajustar automáticamente:
      // 1. Se añaden los primeros 2+ puntos (inicio de ruta)
      // 2. No hay interacción previa del usuario con el mapa
      // 3. Ha pasado tiempo suficiente desde el último ajuste (para evitar ajustes continuos)
      // 4. El número de coordenadas cambió significativamente (eliminación o adición de varios puntos)
      return (
        (routeCoordinates.length >= 2 && lastCoordCountRef.current < 2) || // Inicio de ruta
        (!userInteracted.current) || // Usuario no ha interactuado aún
        (timeSinceLastFit > 3000 && Math.abs(routeCoordinates.length - lastCoordCountRef.current) > 3) // Cambio significativo
      );
    };
    
    // Solo ajustar cuando hay al menos 2 puntos Y cumplimos los criterios
    if (routeCoordinates.length > 1 && shouldFitBounds()) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
      lastFitBoundsRef.current = Date.now(); // Registrar tiempo de este ajuste
    }
    
    // Actualizar referencia del conteo de coordenadas
    lastCoordCountRef.current = routeCoordinates.length;
    
    // Notificar que el mapa está listo
    if (onMapReady) {
      // Esperar un poco para asegurar que los tiles se hayan cargado
      setTimeout(() => {
        onMapReady();
      }, 300);
    }
  }, [map, routeCoordinates, onMapReady]);

  return null;
}

// Componente para gestionar los eventos de clic en el mapa
function MapEvents({ onMapClick, editable }) {
  const map = useMapEvents({
    click: (e) => {
      if (editable && onMapClick) {
        onMapClick(e);
      }
    }
  });
  
  return null;
}

// Función para calcular la distancia entre dos puntos en kilómetros
const calculateDistance = (coord1, coord2) => {
  if (!coord1 || !coord2) return 0;
  
  // Radio de la Tierra en kilómetros
  const R = 6371;
  
  // Convertir coordenadas de grados a radianes
  const lat1 = (coord1[0] * Math.PI) / 180;
  const lon1 = (coord1[1] * Math.PI) / 180;
  const lat2 = (coord2[0] * Math.PI) / 180;
  const lon2 = (coord2[1] * Math.PI) / 180;
  
  // Fórmula de Haversine
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Función para calcular la distancia total de una ruta
const calculateTotalDistance = (coords) => {
  if (!coords || coords.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    totalDistance += calculateDistance(coords[i], coords[i+1]);
  }
  
  return totalDistance;
};

// Función para estimar la duración en minutos basada en la distancia
const estimateDuration = (distanceKm) => {
  // Suponemos una velocidad media de 90 km/h para una ruta en moto
  // Convertir a horas y luego a minutos
  const hoursEstimated = distanceKm / 90;
  const minutesEstimated = Math.ceil(hoursEstimated * 60);
  
  // Mínimo 1 minuto
  return Math.max(1, minutesEstimated);
};

const RouteMap = ({ routeData, editable = false, onChange, onRouteMetadataChange, onMapCapture }) => {
  // Si se proporciona routeData como string (desde la BD), lo convertimos a array de coordenadas
  const [coordinates, setCoordinates] = useState(() => {
    if (!routeData) return [];
    if (typeof routeData === 'string' && routeData.trim() !== '') {
      try {
        return JSON.parse(routeData);
      } catch (e) {
        console.error('Error al parsear las coordenadas:', e);
        return [];
      }
    }
    return Array.isArray(routeData) ? routeData : [];
  });
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [country, setCountry] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [countryDetectionStatus, setCountryDetectionStatus] = useState('idle'); // idle, detecting, detected, error
  const [mapLoaded, setMapLoaded] = useState(false); 
  // Estado para el spinner del mapa
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const isUpdatingMetadata = useRef(false);
  const lastCoordinatesLength = useRef(coordinates.length);
  const countryDetectionTimer = useRef(null);
  // Función para obtener el país mediante geocodificación inversa
  const getCountryFromCoordinates = useCallback(async (coords) => {
    if (!coords || coords.length === 0) return null;
    
    try {
      // Usamos el punto medio de la ruta para determinar el país
      const midIndex = Math.floor(coords.length / 2);
      const [lat, lon] = coords[midIndex];
      
      // Cache con resolución reducida para encontrar coincidencias cercanas
      // Redondeamos a 1 decimal para extender el área de caché
      const cacheKeyLowRes = `geo_country_${lat.toFixed(1)}_${lon.toFixed(1)}`;
      // Clave de caché precisa
      const cacheKeyExact = `geo_country_${lat.toFixed(4)}_${lon.toFixed(4)}`;
      
      // Primero intentamos con la caché exacta
      const cachedExactData = localStorage.getItem(cacheKeyExact);
      
      // Verificar caché exacta
      if (cachedExactData) {
        try {
          const cachedCountryData = JSON.parse(cachedExactData);
          const cacheTime = cachedCountryData.timestamp || 0;
          const now = Date.now();
          
          // Si la caché es reciente (menos de 30 días), la usamos
          if (now - cacheTime < 30 * 24 * 60 * 60 * 1000) {
            // console.log('Usando país desde caché exacta:', cachedCountryData.country.name);
            return cachedCountryData.country;
          }
        } catch (e) {
          console.warn('Error al analizar datos de país en caché exacta:', e);
        }
      }
      
      // Luego intentamos con una caché de menor resolución (área más amplia)
      const cachedLowResData = localStorage.getItem(cacheKeyLowRes);
      
      if (cachedLowResData) {
        try {
          const cachedCountryData = JSON.parse(cachedLowResData);
          const cacheTime = cachedCountryData.timestamp || 0;
          const now = Date.now();
          
          // Si la caché es reciente (menos de 30 días), la usamos
          if (now - cacheTime < 30 * 24 * 60 * 60 * 1000) {
            // console.log('Usando país desde caché aproximada:', cachedCountryData.country.name);
            return cachedCountryData.country;
          }
        } catch (e) {
          console.warn('Error al analizar datos de país en caché aproximada:', e);
        }
      }
      
      // Usamos la API de OpenStreetMap Nominatim con un timeout para evitar esperas muy largas
      // console.log('Consultando API para obtener país...');
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=5`,
        { 
          timeout: 5000, // Timeout de 5 segundos para evitar esperas muy largas
          headers: {
            // Añadimos un encabezado de usuario para cumplir con las políticas de Nominatim
            'User-Agent': 'JohnyMotorbikeApp/1.0'
          }
        }
      );
      
      if (response.data && response.data.address && response.data.address.country) {
        const detectedCountry = response.data.address.country;
        // Intentar obtener el código de país en formato ISO 3166-1 alpha-2 (ES, UK, US, etc.)
        const countryCode = response.data.address.country_code ? 
          response.data.address.country_code.toUpperCase() : null;
        
        // Guardamos el resultado en localStorage para futuras consultas (ambas claves)
        const countryData = {
          name: detectedCountry,
          code: countryCode
        };
        
        const cacheData = JSON.stringify({
          country: countryData,
          timestamp: Date.now()
        });
        
        try {
          // Guardamos en ambos niveles de caché
          localStorage.setItem(cacheKeyExact, cacheData);
          localStorage.setItem(cacheKeyLowRes, cacheData);
          
          
          if (countryCode === 'ES') {
            // Guardar caché genérica para España
            localStorage.setItem('geo_country_spain', cacheData);
          }
        } catch (e) {
          console.warn('Error al guardar país en caché:', e);
        }
        
        // console.log('País obtenido de API:', detectedCountry);
        
        // Devolvemos un objeto con el nombre del país y su código
        return countryData;
      }
    } catch (error) {
      // Capturamos específicamente los errores de timeout
      if (error.code === 'ECONNABORTED') {
        console.error('Timeout al obtener el país. Usando datos aproximados.');
        return { name: 'Desconocido', code: null };
      }
      console.error('Error al obtener el país:', error);
    }
    
    return null;
  }, []);// Cuando cambian las coordenadas, calculamos los metadatos de la ruta
  // Usamos un efecto separado para las actualizaciones de metadatos básicos (distancia y duración)
  useEffect(() => {
    if (coordinates.length >= 2 && editable && onRouteMetadataChange) {
      // Calcular distancia
      const distance = calculateTotalDistance(coordinates);
      const distanceRounded = parseFloat(distance.toFixed(2));
      
      // Estimar duración
      const duration = estimateDuration(distance);
      
      // Notificar al componente padre con los datos que no requieren API
      onRouteMetadataChange({
        distance: distanceRounded,
        duration,
        country: countryInfo ? countryInfo.name : null,
        countryCode: countryInfo ? countryInfo.code : null
      });
    }
  }, [coordinates, editable, onRouteMetadataChange, countryInfo]);
  // Efecto separado para la obtención de país (operación potencialmente costosa)
  useEffect(() => {
    // Limpiamos cualquier temporizador existente
    if (countryDetectionTimer.current) {
      clearTimeout(countryDetectionTimer.current);
    }
    
    const fetchCountryData = async () => {
      // Evitamos actualizaciones recursivas y solo ejecutamos cuando sea necesario
      if (isUpdatingMetadata.current || !editable || coordinates.length < 2 || !onRouteMetadataChange) return;
      
      // Verificamos si ya tenemos información de país y si ya hay suficientes puntos
      // Para mejorar el rendimiento, solo obtenemos el país:
      // 1. Al inicio (cuando no hay información de país)
      // 2. Cuando se añaden los 2 primeros puntos
      // 3. Cuando se completan 5 puntos
      // 4. Si ha cambiado significativamente la ubicación del punto medio desde la última detección
      
      const shouldDetectCountry = 
        !countryInfo || 
        coordinates.length === 2 || 
        coordinates.length === 5 ||
        (coordinates.length > 5 && coordinates.length % 10 === 0) || // Reducimos la frecuencia de consultas
        countryDetectionStatus === 'error'; // Reintentar tras error
      
      if (shouldDetectCountry) {
        // Establecemos un indicador visual de "detectando" inmediatamente
        setCountryDetectionStatus('detecting');
        setCountry("Detectando...");
        
        isUpdatingMetadata.current = true;
        
        // Establecemos un timeout para la detección máxima (10 segundos)
        const detectionTimeout = setTimeout(() => {
          if (isUpdatingMetadata.current && countryDetectionStatus === 'detecting') {
            // console.log('Detección de país cancelada por timeout');
            setCountryDetectionStatus('error');
            isUpdatingMetadata.current = false;
            
            // Si tenemos un país anterior, lo mantenemos
            if (!country || country === "Detectando...") {
              setCountry("Desconocido");
              
              // Notificar con un valor genérico si no había país previo
              if (!countryInfo) {
                onRouteMetadataChange({
                  distance: calculateTotalDistance(coordinates).toFixed(2),
                  duration: estimateDuration(calculateTotalDistance(coordinates)),
                  country: "Desconocido",
                  countryCode: null
                });
              }
            }
          }
        }, 10000); // 10 segundos máximo para la detección
        
        try {
          // Intentamos obtener el país lo más rápido posible usando caché
          // console.log('Iniciando detección de país...');
          const detectedCountryInfo = await getCountryFromCoordinates(coordinates);
          
          // Limpiamos el timeout de protección
          clearTimeout(detectionTimeout);
          
          if (detectedCountryInfo) {
            // Solo actualizamos si hay un cambio real o no había información previa
            if (!countryInfo || countryInfo.name !== detectedCountryInfo.name) {
              // console.log('País detectado correctamente:', detectedCountryInfo.name);
              setCountryInfo(detectedCountryInfo);
              setCountry(detectedCountryInfo.name);
              setCountryDetectionStatus('detected');
              
              // Solo enviamos una actualización si cambia el país
              onRouteMetadataChange({
                distance: calculateTotalDistance(coordinates).toFixed(2),
                duration: estimateDuration(calculateTotalDistance(coordinates)),
                country: detectedCountryInfo.name,
                countryCode: detectedCountryInfo.code
              });
            } else {
              setCountryDetectionStatus('detected');
            }
          } else {
            // console.log('No se pudo detectar el país');
            setCountryDetectionStatus('error');
            // No se detectó país, pero no es un error técnico
            if (!country || country === "Detectando...") {
              setCountry("Desconocido");
            }
          }
        } catch (error) {
          // Limpiamos el timeout de protección
          clearTimeout(detectionTimeout);
          
          console.error('Error en la detección del país:', error);
          setCountryDetectionStatus('error');
          
          // En caso de error, seguimos mostrando el país anterior si existe
          if (!country || country === "Detectando...") {
            setCountry("Desconocido");
          }
        } finally {
          // Aseguramos desactivar la bandera
          isUpdatingMetadata.current = false;
        }
      }
    };
    
    // Usamos un retardo más corto para responder más rápidamente
    // pero aún evitar múltiples llamadas en rápida sucesión
    countryDetectionTimer.current = setTimeout(fetchCountryData, 150);
    
    // Limpiamos el temporizador al desmontar o cuando cambien las dependencias
    return () => {
      if (countryDetectionTimer.current) {
        clearTimeout(countryDetectionTimer.current);
      }
    };
    
  }, [coordinates.length, coordinates, editable, getCountryFromCoordinates, onRouteMetadataChange, countryInfo, country, countryDetectionStatus]);// Cuando cambian las coordenadas y el componente es editable, notificamos al componente padre
  useEffect(() => {
    // Solo ejecutamos si es necesario y si realmente cambió el número de coordenadas
    if (editable && onChange && coordinates.length !== lastCoordinatesLength.current) {
      // Usamos JSON.stringify para comparar los arrays y evitar bucles infinitos
      const stringCoords = JSON.stringify(coordinates);
      const stringRouteData = typeof routeData === 'string' ? routeData : JSON.stringify(routeData);
      
      // Solo notificar cambios si realmente hay diferencias
      if (stringCoords !== stringRouteData) {
        onChange(coordinates);
      }
      
      // Actualizamos la referencia del último valor conocido
      lastCoordinatesLength.current = coordinates.length;
    }
  }, [coordinates, editable, onChange, routeData]);
    // Función para manejar clics en el mapa (añadir puntos)
  const handleMapClick = (e) => {
    if (!editable) return;
    
    const newCoord = [e.latlng.lat, e.latlng.lng];
    setCoordinates(prev => [...prev, newCoord]);
  };

  // Función para eliminar un punto
  const handlePointRemove = (index) => {
    if (!editable) return;
    
    setCoordinates(prev => prev.filter((_, i) => i !== index));
  };
  // Función para mover un punto
  const handlePointDrag = (index, position) => {
    if (!editable) return;
    
    setCoordinates(prev => {
      const newCoordinates = [...prev];
      newCoordinates[index] = [position.lat, position.lng];
      return newCoordinates;
    });
  };  // Usamos useCallback para memoizar la función y evitar recreaciones innecesarias
  const captureMap = useCallback(() => {
    // Solo ejecutamos si hay callbacks registrados
    if (onMapCapture && typeof onMapCapture === 'function') {
      
      onMapCapture('auto_generated_map');
    }
    return 'auto_generated_map';
  }, [onMapCapture]);

  useEffect(() => {
    // Usar una referencia para evitar llamadas duplicadas
    const shouldCapture = editable && coordinates.length >= 2 && onMapCapture;
    
    if (shouldCapture) {
      // Solo notificamos una vez cuando hay suficientes coordenadas, no en cada render
      const imageNotificationTimer = setTimeout(() => {
        onMapCapture('auto_generated_map');
      }, 100);
      
      return () => clearTimeout(imageNotificationTimer);
    }
  }, [coordinates.length, editable, onMapCapture]);

  // Ubicación por defecto centrada en España si no hay coordenadas
  const defaultPosition = [40.416775, -3.703790]; // Madrid, España
  const initialPosition = coordinates.length > 0 ? coordinates[0] : defaultPosition;  return (
    <div className="route-map-container relative" 
         style={{ height: editable ? '500px' : '400px', width: '100%' }}
         ref={mapContainerRef}>
      {/* Spinner de carga para el mapa */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-2"></div>
            <p className="text-gray-600 font-medium">Cargando mapa...</p>
          </div>
        </div>
      )}
      
      {/* Botón flotante para borrar ruta (visible cuando hay puntos) */}
      {editable && coordinates.length > 0 && (
        <div className="absolute top-3 right-3 z-40">
          <button 
            onClick={() => setCoordinates([])}
            className="bg-white p-2 rounded-md shadow-md hover:bg-red-100 flex items-center border border-gray-300"
            title="Borrar toda la ruta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="ml-1 text-sm font-medium text-red-600">Borrar</span>
          </button>
        </div>
      )}
      
      {/* Aseguramos que el mapa tenga un z-index menor que el header (z-50) */}
      <MapContainer 
        center={initialPosition} 
        zoom={editable ? 13 : 10} 
        style={{ height: '100%', width: '100%', zIndex: 30 }} // z-index menor que el header
        className="z-30" // Reforzamos con una clase
        ref={mapRef}
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Polyline para mostrar la ruta */}
        {coordinates.length > 1 && (
          <Polyline 
            positions={coordinates} 
            color={editable ? "#3388ff" : "#d35400"}
            weight={5}
            opacity={0.8}
          />
        )}
        
        {/* Marcadores para cada punto de la ruta */}
        {coordinates.map((position, idx) => (
          <Marker 
            key={idx}
            position={position}
            draggable={editable}
            eventHandlers={{
              click: () => editable && handlePointRemove(idx),
              dragend: (e) => editable && handlePointDrag(idx, e.target.getLatLng()),
              mouseover: () => setSelectedPoint(`Punto ${idx + 1}`),
              mouseout: () => setSelectedPoint(null)
            }}
            title={`Punto ${idx + 1}${editable ? " - Click para eliminar" : ""}`}
          />
        ))}
          {/* Componente para ajustar la vista a los límites de la ruta */}
        <FitBounds 
          routeCoordinates={coordinates} 
          onMapReady={() => setMapLoaded(true)}
        />
        
        {/* Componente para gestionar eventos del mapa */}
        <MapEvents onMapClick={handleMapClick} editable={editable} />
      </MapContainer>
        {editable && (
        <div className="map-instructions mt-2 text-sm text-gray-600">
          <p>• Haz clic en el mapa para añadir puntos a la ruta</p>
          <p>• Haz clic en un marcador para eliminarlo</p>
          <p>• Arrastra los marcadores para ajustar la ruta</p>
            {/* Opciones de la ruta - Botón para borrar más prominente */}
          {coordinates.length > 0 && (
            <div className="flex justify-between items-center mt-3 mb-2">
              <span className="text-sm font-medium">
                {coordinates.length} {coordinates.length === 1 ? 'punto marcado' : 'puntos marcados'}
              </span>
              <button 
                onClick={() => setCoordinates([])} 
                className="px-4 py-2 bg-red-600 text-white rounded flex items-center hover:bg-red-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Borrar toda la ruta
              </button>
            </div>
          )}   
                 {/* Mostrar información calculada de la ruta */}
          {coordinates.length >= 2 && (
            <div className="route-info mt-2 p-2 bg-blue-50 rounded">
              <p className="font-medium">Información calculada automáticamente:</p>
              <p>• Distancia: <span className="font-medium">{calculateTotalDistance(coordinates).toFixed(2)} km</span></p>
              <p>• Tiempo estimado: <span className="font-medium">{estimateDuration(calculateTotalDistance(coordinates))} minutos</span></p>              {/* Información del país con indicadores de estado mejorados */}
              <p>• País: 
                {countryDetectionStatus === 'detecting' ? (
                  <span className="flex items-center ml-1">
                    <span className="animate-pulse text-blue-600">Detectando</span>
                    <span className="inline-flex ml-1">
                      <span className="animate-bounce delay-75 text-blue-600">.</span>
                      <span className="animate-bounce delay-150 text-blue-600">.</span>
                      <span className="animate-bounce delay-300 text-blue-600">.</span>
                    </span>
                  </span>
                ) : countryDetectionStatus === 'error' ? (
                  <span className="ml-1 text-orange-600">
                    Desconocido <button onClick={() => setCountryDetectionStatus('idle')} className="ml-1 text-xs text-blue-600 underline">Reintentar</button>
                  </span>
                ) : (
                  <span className="font-medium ml-1">
                    {countryInfo ? countryInfo.name : country || 'Desconocido'}
                    {countryInfo && countryInfo.code && (
                      <img 
                        src={`https://flagcdn.com/16x12/${countryInfo.code.toLowerCase()}.png`}
                        alt={`Bandera de ${countryInfo.name}`}
                        className="inline ml-2 h-3"
                      />
                    )}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteMap;
