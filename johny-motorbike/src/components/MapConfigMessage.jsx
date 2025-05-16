// Componente de mensaje para cuando falte la configuración API de mapas
import { useState, useEffect } from 'react';

const MapConfigMessage = () => {
  const [dismissed, setDismissed] = useState(false);
  const [hasValidApiKey, setHasValidApiKey] = useState(true);
  // Verificar si hay una API key válida
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    // Comprobar si la API key existe y no es un valor placeholder o inválido
    const isValid = apiKey && 
                   apiKey !== 'add-your-api-key-here' && 
                   apiKey !== '' && 
                   apiKey !== 'cdb052cc1e544341a966e8874d12d7ce' &&
                   apiKey.length > 10; // Las API key suelen tener más de 10 caracteres
                   
    console.log("Validación de API Key:", { 
      presente: !!apiKey, 
      valida: isValid,
      longitud: apiKey ? apiKey.length : 0,
      key: apiKey ? apiKey.substring(0, 5) + '...' : 'no definida',
      api: apiKey
    });
    
    // Verificar con una petición a Geoapify que la API key es válida
    if (isValid) {
      fetch(`https://api.geoapify.com/v1/geocode/search?text=Madrid&apiKey=${apiKey}&limit=1`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('API key no válida');
        })
        .then(() => {
          console.log('API key de Geoapify verificada correctamente');
          setHasValidApiKey(true);
        })
        .catch(error => {
          console.error('Error verificando API key:', error);
          setHasValidApiKey(false);
        });
    } else {
      setHasValidApiKey(false);
    }
  }, []);
  
  // No mostrar si ya fue descartado o si hay una API key válida
  if (dismissed || hasValidApiKey) return null;
  
  return (
    <div className="fixed bottom-5 left-5 max-w-md bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 shadow-md rounded-md z-40">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            Error de configuración de mapas: API Key no configurada
          </p>
          <p className="text-xs mt-1">
            Para ver los mapas de rutas, necesitas configurar una clave API de Geoapify en el archivo .env.local
          </p>
          <div className="mt-2">
            <a 
              href="/CÓMO_CONFIGURAR_MAPAS.md" 
              target="_blank"
              className="text-xs underline text-yellow-800 hover:text-yellow-900"
            >
              Ver instrucciones
            </a>
            <button 
              className="ml-3 text-xs text-gray-600 hover:text-gray-800" 
              onClick={() => setDismissed(true)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapConfigMessage;
