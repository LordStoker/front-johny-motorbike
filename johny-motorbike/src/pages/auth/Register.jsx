import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

export default function Register() {
  const navigate = useNavigate()
  const { register, authError, authLoading } = useAppContext()

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name) {
      errors.name = 'El nombre es obligatorio'
    }
    if (!formData.last_name) {
      errors.last_name = 'El apellido es obligatorio'
    }
    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de correo electrónico inválido'
    }
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Confirma tu contraseña'
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Las contraseñas no coinciden'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      const success = await register(
        formData.name,
        formData.last_name,
        formData.email,
        formData.password
      )
      if (success) {
        navigate('/')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-blue-100">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-2 tracking-tight drop-shadow-sm">Crear cuenta</h2>
          <p className="text-gray-500 text-base">Regístrate para comenzar tu aventura</p>
        </div>
        {authError && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4 text-center animate-pulse">
            {authError}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-900 mb-1">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${formErrors.name ? 'border-red-400' : 'border-blue-200'}`}
                placeholder="Tu nombre"
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-blue-900 mb-1">Apellido</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                value={formData.last_name}
                onChange={handleChange}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${formErrors.last_name ? 'border-red-400' : 'border-blue-200'}`}
                placeholder="Tu apellido"
              />
              {formErrors.last_name && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.last_name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${formErrors.email ? 'border-red-400' : 'border-blue-200'}`}
                placeholder="ejemplo@email.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${formErrors.password ? 'border-red-400' : 'border-blue-200'}`}
                placeholder="Crea una contraseña"
              />
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-blue-900 mb-1">Confirmar contraseña</label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${formErrors.password_confirmation ? 'border-red-400' : 'border-blue-200'}`}
                placeholder="Repite la contraseña"
              />
              {formErrors.password_confirmation && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.password_confirmation}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/login" className="text-blue-700 hover:underline font-semibold">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {authLoading ? 'Procesando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  )
}
