import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import RouteMap from '../components/RouteMap';

// URL base de la API
const API_URL = 'http://johny-motorbike.test/api';

export default function NewRuta() {
  const navigate = useNavigate();
  const { difficulties, terrains, landscapes, countries, reloadResource, showNotification } = useAppContext();
    const [formData, setFormData] = useState({
    name: '',
    description: '',
    distance: '',
    duration: '', // Duración estimada en minutos
    difficulty_id: '',
    image: '',
    map_image: '', // Imagen capturada del mapa
    terrain_id: '',
    landscape_id: '',
    country_id: '',
    route_map: [] // Array de coordenadas para la ruta en el mapa
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores de validación cuando el usuario modifica un campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };  // Manejar los cambios en el mapa (coordenadas de la ruta)
  const handleRouteMapChange = useCallback((coordinates) => {
    // Evita re-renderizados innecesarios si las coordenadas son iguales
    const current = JSON.stringify(formData.route_map);
    const updated = JSON.stringify(coordinates);
    
    if (current !== updated) {
      setFormData(prev => ({
        ...prev,
        route_map: coordinates
      }));
    }
  }, [formData.route_map]);
    // Manejar la captura del mapa como imagen
  const handleMapCapture = useCallback((imageBase64) => {
    if (formData.map_image !== imageBase64) {
      setFormData(prev => ({
        ...prev,
        map_image: imageBase64
      }));
    }
  }, [formData.map_image]);
    // Manejar los metadatos calculados de la ruta (distancia, duración, país)
  const handleRouteMetadataChange = useCallback((metadata) => {
    // Actualizar los campos correspondientes
    setFormData(prev => {
      const updates = {};
      
      // Actualizar la distancia si ha cambiado
      if (metadata.distance && (!prev.distance || Math.abs(parseFloat(prev.distance) - metadata.distance) > 0.1)) {
        updates.distance = metadata.distance.toString();
      }
      
      // Actualizar la duración si ha cambiado
      if (metadata.duration && (!prev.duration || parseInt(prev.duration) !== metadata.duration)) {
        updates.duration = metadata.duration.toString();
      }        // Buscar el ID del país si se encontró uno
      if (countries.length > 0 && metadata.country && metadata.country !== 'Detectando...') {
        let countryObject = null;
        
        // Primero intentar encontrar el país por código (más preciso)
        if (metadata.countryCode) {
          countryObject = countries.find(c => 
            c.code && c.code.toLowerCase() === metadata.countryCode.toLowerCase()
          );
          
          // if (countryObject) {
          //   console.log('País encontrado por código:', countryObject.name);
          // }
        }
        
        // Si no se encontró por código, intentar por nombre (menos preciso)
        if (!countryObject && metadata.country) {
          // Evitar procesar si el país está en proceso de detección
          if (metadata.country === "Detectando..." || metadata.country === "Desconocido") {
            return prev;
          }
          
          // Crear una versión simplificada del nombre para comparar (sin acentos, en minúsculas)
          const normalizedCountryName = metadata.country.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Eliminar acentos
          
          // console.log('Buscando coincidencia para país:', metadata.country);
            
          // Tabla de equivalencias para algunos países comunes (ampliada)
          const countryEquivalents = {
            'españa': ['spain', 'espana', 'espanha'],
            'estados unidos': ['united states', 'usa', 'us', 'united states of america', 'estados unidos de america'],
            'francia': ['france'],
            'alemania': ['germany', 'deutschland'],
            'reino unido': ['united kingdom', 'uk', 'great britain', 'england', 'inglaterra'],
            'italia': ['italy'],
            'portugal': ['portugal'],
            'japón': ['japan', 'japon'],
            'china': ['china'],
            'méxico': ['mexico', 'mexiko'],
            'canadá': ['canada'],
            'brasil': ['brazil', 'brasil'],
            'argentina': ['argentina'],
            'colombia': ['colombia'],
            'australia': ['australia'],
            'rusia': ['russia', 'russian federation'],
            'india': ['india']
          };
          
          // Buscar coincidencias aproximadas
          countryObject = countries.find(c => {
            if (!c.name) return false;
            
            const normalizedName = c.name.toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            // Verificar equivalencias exactas
            for (const [key, values] of Object.entries(countryEquivalents)) {
              if (normalizedCountryName === key && values.includes(normalizedName)) {
                return true;
              }
              if (values.includes(normalizedCountryName) && normalizedName === key) {
                return true;
              }
            }
            
            // Verificar contenciones parciales (más flexible)
            if (normalizedName.includes(normalizedCountryName) || normalizedCountryName.includes(normalizedName)) {
              return true;
            }
            
            // Verificar coincidencias con un umbral de tolerancia mayor
            // para países con nombres muy diferentes en distintos idiomas
            return normalizedName === normalizedCountryName || 
                   (normalizedCountryName.length > 3 && normalizedName.includes(normalizedCountryName.substring(0, 4))) ||
                   (normalizedName.length > 3 && normalizedCountryName.includes(normalizedName.substring(0, 4)));
          });
          
          if (countryObject) {
            // console.log('País encontrado por nombre:', countryObject.name);
          }
        }
        
        if (countryObject && (!prev.country_id || prev.country_id !== countryObject.id.toString())) {
          // console.log('País asignado:', countryObject.name);
          updates.country_id = countryObject.id.toString();
        }
      }
      
      // Si no hay cambios, devolver el estado anterior
      if (Object.keys(updates).length === 0) {
        return prev;
      }
      
      // Aplicar actualizaciones
      return {
        ...prev,
        ...updates
      };
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Crear un objeto con los datos convertidos correctamente
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        distance: parseFloat(formData.distance),
        duration: parseFloat(formData.duration || 0), // Duración en minutos
        difficulty_id: parseInt(formData.difficulty_id),
        terrain_id: parseInt(formData.terrain_id),
        landscape_id: parseInt(formData.landscape_id),
        country_id: parseInt(formData.country_id)
      };      // Priorizar la imagen del mapa, si no está disponible usar la URL externa
      if (formData.map_image) {
        dataToSend.image = formData.map_image;
      } else if (formData.image && formData.image.trim()) {
        dataToSend.image = formData.image;
      }
      
      // Agregar las coordenadas de la ruta si existen
      if (formData.route_map && formData.route_map.length > 1) {
        dataToSend.route_map = JSON.stringify(formData.route_map);
      }

      // Mostrar los datos que se van a enviar en la consola (para depuración)
      // console.log('Datos a enviar:', dataToSend);
      
      // Realizar la petición POST al backend para crear la nueva ruta
      const response = await axios.post(`${API_URL}/route`, dataToSend);
      
      // console.log('Respuesta del servidor:', response.data);
        // Recargar las rutas en el contexto global
      await reloadResource('route');
      
      // Mostrar notificación de éxito
      showNotification(`¡Ruta "${formData.name}" creada correctamente!`, 'success', 3000);
      
      // Redirigir a la página de rutas después de un envío exitoso
      navigate('/rutas');
    } catch (err) {
      // console.error('Error al crear la ruta:', err);
      
      // Manejar errores de validación del backend
      if (err.response && err.response.data && err.response.data.errors) {
        setValidationErrors(err.response.data.errors);
        setError('Por favor, corrige los errores en el formulario.');
      } else if (err.response && err.response.data && err.response.data.message) {
        // Mostrar mensaje de error específico del servidor
        setError(`Error: ${err.response.data.message}`);
      } else {
        // Mensaje de error genérico
        setError('Error al guardar la ruta. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función auxiliar para mostrar errores de validación
  const getErrorMessage = (fieldName) => {
    return validationErrors[fieldName] ? 
      <span className="text-red-500 text-xs">{validationErrors[fieldName][0]}</span> : 
      null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Crear Nueva Ruta</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-800">
          <h2 className="text-lg font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            ¿Cómo crear una ruta?
          </h2>
          <p className="mt-1">Dibuja tu ruta en el mapa marcando al menos 2 puntos. La distancia, duración y país se completarán automáticamente.</p>
          <p className="mt-2 text-sm text-blue-600"><strong>Nota:</strong> La detección automática del país puede tardar unos segundos en completarse.</p>
        </div>
        
        {/* Componente de mapa para crear la ruta - Movido a la parte superior */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Dibuja tu Ruta en el Mapa
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">            <RouteMap 
              editable={true} 
              onChange={handleRouteMapChange}
              onRouteMetadataChange={handleRouteMetadataChange}
              onMapCapture={handleMapCapture}
              routeData={formData.route_map}
            />
          </div>
          
          <div className="mt-2 space-y-2">            {/* Información sobre el país detectado */}
            {formData.country_id ? (
              <div className="text-sm bg-blue-50 border border-blue-200 rounded p-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>
                  País detectado automáticamente: <span className="font-medium">
                    {countries.find(c => c.id.toString() === formData.country_id)?.name || 'Desconocido'}
                  </span>
                </span>
              </div>
            ) : formData.route_map?.length >= 2 ? (
              <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="flex items-center">
                  Detectando país...
                  <span className="ml-2">
                    <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></span>
                    <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full animate-pulse mx-1" style={{animationDelay: '0.2s'}}></span>
                    <span className="inline-block w-2 h-2 bg-yellow-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                  </span>
                </span>
              </div>
            ) : null}
            
            {/* Número de puntos en el mapa */}
            {formData.route_map && formData.route_map.length > 0 && (
              <p className={`text-sm ${formData.route_map.length >= 2 ? 'text-green-600' : 'text-yellow-600'}`}>
                {formData.route_map.length} puntos marcados en el mapa
                {formData.route_map.length < 2 && " - Se necesitan al menos 2 puntos para crear una ruta"}
              </p>
            )}
            
            {getErrorMessage('route_map')}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nombre de la Ruta
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              validationErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {getErrorMessage('name')}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              validationErrors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {getErrorMessage('description')}
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="distance" className="block text-gray-700 font-bold mb-2">
              Distancia (km)
              <span className="ml-2 text-xs font-normal text-blue-600">
                (calculada automáticamente)
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                readOnly
                className={`w-full px-3 py-2 border rounded-md bg-gray-50 cursor-not-allowed ${
                  validationErrors.distance ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {getErrorMessage('distance')}
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">
              Duración (min)
              <span className="ml-2 text-xs font-normal text-blue-600">
                (calculada automáticamente)
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                readOnly
                className={`w-full px-3 py-2 border rounded-md bg-gray-50 cursor-not-allowed ${
                  validationErrors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                min="0"
                step="1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {getErrorMessage('duration')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="difficulty_id" className="block text-gray-700 font-bold mb-2">
              Dificultad
            </label>
            <select
              id="difficulty_id"
              name="difficulty_id"
              value={formData.difficulty_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                validationErrors.difficulty_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Selecciona una dificultad</option>
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
            {getErrorMessage('difficulty_id')}
          </div>

          <div className="mb-4">
            <label htmlFor="terrain_id" className="block text-gray-700 font-bold mb-2">
              Tipo de Terreno
            </label>
            <select
              id="terrain_id"
              name="terrain_id"
              value={formData.terrain_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                validationErrors.terrain_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Selecciona un terreno</option>
              {terrains.map(terrain => (
                <option key={terrain.id} value={terrain.id}>
                  {terrain.name}
                </option>
              ))}
            </select>
            {getErrorMessage('terrain_id')}
          </div>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="landscape_id" className="block text-gray-700 font-bold mb-2">
              Paisaje
            </label>
            <select
              id="landscape_id"
              name="landscape_id"
              value={formData.landscape_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                validationErrors.landscape_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Selecciona un paisaje</option>
              {landscapes.map(landscape => (
                <option key={landscape.id} value={landscape.id}>
                  {landscape.name}
                </option>
              ))}
            </select>
            {getErrorMessage('landscape_id')}
          </div>

          {/* El campo de país ahora está oculto ya que se selecciona automáticamente según las coordenadas del mapa */}
          <input 
            type="hidden" 
            name="country_id" 
            value={formData.country_id} 
          />
          {getErrorMessage('country_id')}
        </div>        {/* Campo de imagen oculto - la imagen se genera automáticamente con geoapify */}
        <input
          type="hidden"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />        {getErrorMessage('image')}
        
        {/* Capturamos la imagen del mapa pero no mostramos la vista previa */}
        {formData.map_image && (
          <input
            type="hidden"
            name="map_image"
            value={formData.map_image}
          />
        )}

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/rutas')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block mr-2">⏳</span>
                Guardando...
              </>
            ) : 'Guardar Ruta'}
          </button>
        </div>
      </form>
    </div>
  );
}
