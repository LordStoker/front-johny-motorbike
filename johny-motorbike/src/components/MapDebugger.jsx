// Componente de utilidad para depurar problemas de generación de mapas
import { useState } from 'react';

/**
 * Componente para mostrar información de depuración de mapas
 * Ayuda a diagnosticar problemas con la generación de mapas estáticos
 */
const MapDebugger = ({ routeId, routeMap, image }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  // Intentar parsear las coordenadas
  let coordinates = [];
  let isValidJson = false;
  try {
    if (typeof routeMap === 'string') {
      coordinates = JSON.parse(routeMap);
      isValidJson = true;
    } else if (Array.isArray(routeMap)) {
      coordinates = routeMap;
      isValidJson = true;
    }
  } catch (e) {
    // Error al parsear
  }

  // Verificar si las coordenadas tienen el formato correcto
  const hasValidStructure = isValidJson && 
    Array.isArray(coordinates) && 
    coordinates.length >= 2 &&
    coordinates.every(coord => Array.isArray(coord) && coord.length === 2);

  // Verificar si cada coordenada contiene valores numéricos válidos
  const hasValidValues = hasValidStructure &&
    coordinates.every(coord => 
      !isNaN(parseFloat(coord[0])) && 
      !isNaN(parseFloat(coord[1])));
  // Generar una URL de ejemplo para OpenStreetMap si hay coordenadas válidas
  let exampleOpenStreetMapUrl = '';
  if (hasValidValues) {
    // Tomar solo algunos puntos para no sobrecargar la URL
    const pathPoints = coordinates.filter((_, idx) => idx % Math.max(1, Math.floor(coordinates.length / 5)) === 0);
    
    // Calcular centro del mapa
    const bounds = coordinates.reduce((acc, coord) => ({
      minLat: Math.min(acc.minLat, parseFloat(coord[0])),
      maxLat: Math.max(acc.maxLat, parseFloat(coord[0])),
      minLng: Math.min(acc.minLng, parseFloat(coord[1])),
      maxLng: Math.max(acc.maxLng, parseFloat(coord[1]))
    }), { 
      minLat: parseFloat(coordinates[0][0]), 
      maxLat: parseFloat(coordinates[0][0]), 
      minLng: parseFloat(coordinates[0][1]), 
      maxLng: parseFloat(coordinates[0][1]) 
    });
    
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    const centerLng = (bounds.minLng + bounds.maxLng) / 2;
    
    // Crear parámetros para OpenStreetMap
    // Limitamos a máximo 5 marcadores para no sobrecargar la URL
    const limitedPoints = pathPoints.length > 5 ? 
      [pathPoints[0], ...pathPoints.filter((_, idx) => idx % Math.ceil(pathPoints.length / 4) === 0), pathPoints[pathPoints.length - 1]] : 
      pathPoints;
    
    const markersParam = limitedPoints
      .map(p => `${p[0]},${p[1]},red`)
      .join('|');
      
    // Ruta para visualizar el recorrido
    const pathParam = pathPoints
      .map(p => `${p[0]},${p[1]}`)
      .join('|');
      // Usar GeoapifyMaps en lugar de OpenStreetMap porque el servicio anterior no está disponible
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    
      // Comprueba si tenemos una clave API válida
    if (apiKey && apiKey !== 'add-your-api-key-here') {
      const geoapifyUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${centerLng},${centerLat}&zoom=9&apiKey=${apiKey}`;
      
      // Añadir marcadores (inicio y fin)
      const firstPoint = pathPoints[0];
      const lastPoint = pathPoints[pathPoints.length - 1];
      const markersUrl = `&marker=lonlat:${firstPoint[1]},${firstPoint[0]};type:awesome;color:%23ff0000;size:medium|lonlat:${lastPoint[1]},${lastPoint[0]};type:awesome;color:%230000ff;size:medium`;
      
      // Añadir la ruta
      const pathLineUrl = `&polyline=width:3;color:%23ff0000;opacity:0.9;${pathPoints.map(p => `${p[1]},${p[0]}`).join(',')}`;
      
      exampleOpenStreetMapUrl = geoapifyUrl + markersUrl + pathLineUrl;
    } else {
      // Usar una URL de imagen de mapa de ejemplo estática si no hay API key
      console.warn('No hay clave API de Geoapify configurada para el depurador de mapas.');
      exampleOpenStreetMapUrl = "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='600'%20height='400'%20viewBox='0%200%20600%20400'%3E%3Crect%20fill='%23e8e8e8'%20width='600'%20height='400'/%3E%3Ctext%20fill='%23666666'%20font-family='Arial'%20font-size='20'%20x='300'%20y='200'%20text-anchor='middle'%3EConfigura%20VITE_GEOAPIFY_API_KEY%20en%20.env.local%3C/text%3E%3C/svg%3E";
    }
  }

  if (!routeMap || !image) return null;

  return (
    
    <div className="fixed bottom-5 right-5 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? "Cerrar depurador" : "Depurar mapa"}
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Diagnóstico de mapa para ruta #{routeId}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-bold mb-2">Estado del mapa:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li className={import.meta.env.VITE_GEOAPIFY_API_KEY && import.meta.env.VITE_GEOAPIFY_API_KEY !== 'add-your-api-key-here' ? "text-green-600" : "text-red-600"}>
                      API Key de Geoapify: {import.meta.env.VITE_GEOAPIFY_API_KEY && import.meta.env.VITE_GEOAPIFY_API_KEY !== 'add-your-api-key-here' ? "✓ Configurada" : "✗ No configurada"}
                    </li>
                    <li className={isValidJson ? "text-green-600" : "text-red-600"}>
                      JSON válido: {isValidJson ? "✓" : "✗"}
                    </li>
                    <li className={hasValidStructure ? "text-green-600" : "text-red-600"}>
                      Estructura correcta: {hasValidStructure ? "✓" : "✗"}
                    </li>
                    <li className={hasValidValues ? "text-green-600" : "text-red-600"}>
                      Valores numéricos válidos: {hasValidValues ? "✓" : "✗"}
                    </li>
                    <li>
                      Tipo de imagen: <span className="font-mono">{image}</span>
                    </li>
                    <li>
                      Puntos en la ruta: {isValidJson ? coordinates.length : "N/A"}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Acciones:</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowRawData(!showRawData)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors w-full text-left"
                    >
                      {showRawData ? "Ocultar datos crudos" : "Ver datos crudos"}
                    </button>
                      {hasValidValues && (
                      <a
                        href={exampleOpenStreetMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 transition-colors w-full text-left"
                      >
                        Ver mapa en OpenStreetMap
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {showRawData && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Datos crudos:</h3>
                  <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs">{JSON.stringify(typeof routeMap === 'string' ? routeMap : coordinates, null, 2)}</pre>
                  </div>
                </div>
              )}
                {hasValidValues && (
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Vista previa del mapa:</h3>
                  <img 
                    src={exampleOpenStreetMapUrl}
                    alt="Vista previa del mapa"
                    className="w-full h-auto rounded-md shadow-md border border-gray-300"
                    onError={(e) => {
                      console.error('Error al cargar vista previa:', e);
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='600'%20height='400'%20viewBox='0%200%20600%20400'%3E%3Crect%20fill='%23f2f2f2'%20width='600'%20height='400'/%3E%3Ctext%20fill='%23999999'%20font-family='Arial'%20font-size='20'%20x='300'%20y='200'%20text-anchor='middle'%3EError%20al%20cargar%20mapa%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDebugger;
