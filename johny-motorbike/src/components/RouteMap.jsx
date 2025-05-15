import { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css'; // Importamos nuestros estilos personalizados
import axios from 'axios';
import html2canvas from 'html2canvas';

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
function FitBounds({ routeCoordinates }) {
  const map = useMap();
  
  useEffect(() => {
    if (routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, routeCoordinates]);

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
  // Suponemos una velocidad media de 60 km/h para una ruta en moto
  // Convertir a horas y luego a minutos
  const hoursEstimated = distanceKm / 60;
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
  const [isCapturingMap, setIsCapturingMap] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
    // Función para obtener el país mediante geocodificación inversa
  const getCountryFromCoordinates = useCallback(async (coords) => {
    if (!coords || coords.length === 0) return null;
    
    try {
      // Usamos el punto medio de la ruta para determinar el país
      const midIndex = Math.floor(coords.length / 2);
      const [lat, lon] = coords[midIndex];
      
      // Usamos la API de OpenStreetMap Nominatim para la geocodificación inversa
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=5`
      );
      
      if (response.data && response.data.address && response.data.address.country) {
        const detectedCountry = response.data.address.country;
        // Intentar obtener el código de país en formato ISO 3166-1 alpha-2 (ES, UK, US, etc.)
        const countryCode = response.data.address.country_code ? 
          response.data.address.country_code.toUpperCase() : null;
          
        
        
        // Devolvemos un objeto con el nombre del país y su código
        return {
          name: detectedCountry,
          code: countryCode
        };
      }
    } catch (error) {
      console.error('Error al obtener el país:', error);
    }
    
    return null;
  }, []);
    // Cuando cambian las coordenadas, calculamos los metadatos de la ruta
  useEffect(() => {
    const updateRouteMetadata = async () => {
      if (coordinates.length >= 2 && editable && onRouteMetadataChange) {
        // Calcular distancia
        const distance = calculateTotalDistance(coordinates);
        const distanceRounded = parseFloat(distance.toFixed(2));
        
        // Estimar duración
        const duration = estimateDuration(distance);
        
        // Obtener país (solo si ha cambiado el número de coordenadas o no tenemos país aún)
        if (!countryInfo || coordinates.length % 3 === 0) {  // Verificar cada 3 puntos añadidos
          const detectedCountryInfo = await getCountryFromCoordinates(coordinates);
          if (detectedCountryInfo) {
            setCountryInfo(detectedCountryInfo);
            setCountry(detectedCountryInfo.name); // Para mostrar en el componente
          }
        }
        
        // Notificar al componente padre
        onRouteMetadataChange({
          distance: distanceRounded,
          duration,
          country: countryInfo ? countryInfo.name : null,
          countryCode: countryInfo ? countryInfo.code : null
        });
      }
    };
    
    updateRouteMetadata();
  }, [coordinates, editable, onRouteMetadataChange, countryInfo, getCountryFromCoordinates]);
    // Cuando cambian las coordenadas y el componente es editable, notificamos al componente padre
  useEffect(() => {
    if (editable && onChange && coordinates.length > 0) {
      // Usamos JSON.stringify para comparar los arrays y evitar bucles infinitos
      const stringCoords = JSON.stringify(coordinates);
      const stringRouteData = typeof routeData === 'string' ? routeData : JSON.stringify(routeData);
      
      // Solo notificar cambios si realmente hay diferencias
      if (stringCoords !== stringRouteData) {
        onChange(coordinates);
      }
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
  };
    // Función para capturar el mapa como una imagen
  const captureMap = useCallback(async () => {
    if (coordinates.length < 2 || !mapContainerRef.current) return null;

    setIsCapturingMap(true);
    
    try {
      // Capture el mapa con html2canvas
      const mapContainer = mapContainerRef.current.querySelector('.leaflet-container');
      const canvas = await html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        scale: 1
      });
      
      // Convertir el canvas a una imagen base64
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
      
      // Si se proporcionó una función de callback, enviarle la imagen
      if (onMapCapture && typeof onMapCapture === 'function') {
        onMapCapture(imageBase64);
      }
      
      return imageBase64;
    } catch (error) {
      console.error('Error al capturar el mapa:', error);
      return null;
    } finally {
      setIsCapturingMap(false);
    }  }, [coordinates, onMapCapture]);

  // Cuando se detectan cambios en las coordenadas y hay al menos 2 puntos, 
  // capturamos automáticamente el mapa si es editable
  useEffect(() => {
    if (editable && coordinates.length >= 2 && onMapCapture) {
      // Esperamos un momento para que el mapa se renderice completamente
      const timer = setTimeout(() => {
        captureMap();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [coordinates, editable, onMapCapture, captureMap]);

  // Ubicación por defecto centrada en España si no hay coordenadas
  const defaultPosition = [40.416775, -3.703790]; // Madrid, España
  const initialPosition = coordinates.length > 0 ? coordinates[0] : defaultPosition;  return (
    <div className="route-map-container relative" 
         style={{ height: editable ? '500px' : '400px', width: '100%' }}
         ref={mapContainerRef}>
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
        <FitBounds routeCoordinates={coordinates} />
        
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
              <p>• Tiempo estimado: <span className="font-medium">{estimateDuration(calculateTotalDistance(coordinates))} minutos</span></p>
              {country && <p>• País detectado: <span className="font-medium">{country}</span></p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteMap;
