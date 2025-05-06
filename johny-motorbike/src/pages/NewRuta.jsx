import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'

// URL base de la API
const API_URL = 'http://johny-motorbike.test/api'

export default function NewRuta() {
  const navigate = useNavigate()
  const { difficulties, terrains, landscapes, countries, reloadResource } = useAppContext()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    distance: '',
    difficulty_id: '',
    image: '',
    terrain_id: '',
    landscape_id: '',
    country_id: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar errores de validación cuando el usuario modifica un campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      // Crear un objeto con los datos convertidos correctamente
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        distance: parseFloat(formData.distance),
        difficulty_id: parseInt(formData.difficulty_id),
        terrain_id: parseInt(formData.terrain_id),
        landscape_id: parseInt(formData.landscape_id),
        country_id: parseInt(formData.country_id)
      }

      // Solo agregar la URL de la imagen si no está vacía
      if (formData.image.trim()) {
        dataToSend.image = formData.image
      }

      // Mostrar los datos que se van a enviar en la consola (para depuración)
      console.log('Datos a enviar:', dataToSend)
      
      // Realizar la petición POST al backend para crear la nueva ruta
      const response = await axios.post(`${API_URL}/route`, dataToSend)
      
      console.log('Respuesta del servidor:', response.data)
      
      // Recargar las rutas en el contexto global
      await reloadResource('route')
      
      // Redirigir a la página de rutas después de un envío exitoso
      navigate('/rutas')
    } catch (err) {
      console.error('Error al crear la ruta:', err)
      
      // Manejar errores de validación del backend
      if (err.response && err.response.data && err.response.data.errors) {
        setValidationErrors(err.response.data.errors)
        setError('Por favor, corrige los errores en el formulario.')
      } else if (err.response && err.response.data && err.response.data.message) {
        // Mostrar mensaje de error específico del servidor
        setError(`Error: ${err.response.data.message}`)
      } else {
        // Mensaje de error genérico
        setError('Error al guardar la ruta. Por favor, inténtalo de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Función auxiliar para mostrar errores de validación
  const getErrorMessage = (fieldName) => {
    return validationErrors[fieldName] ? 
      <span className="text-red-500 text-xs">{validationErrors[fieldName][0]}</span> : 
      null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Crear Nueva Ruta</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="distance" className="block text-gray-700 font-bold mb-2">
              Distancia (km)
            </label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                validationErrors.distance ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              step="0.01"
            />
            {getErrorMessage('distance')}
          </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="mb-4">
          <label htmlFor="country_id" className="block text-gray-700 font-bold mb-2">
            País
          </label>
          <select
            id="country_id"
            name="country_id"
            value={formData.country_id}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              validationErrors.country_id ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Selecciona un país</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {getErrorMessage('country_id')}
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
            URL de la imagen
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              validationErrors.image ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {getErrorMessage('image')}
          <p className="text-gray-500 text-xs mt-1">Deja este campo vacío para usar una imagen predeterminada</p>
        </div>

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
  )
}