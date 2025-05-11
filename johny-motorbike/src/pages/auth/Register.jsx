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
  
  // Estados para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  // Funciones para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${formErrors.password ? 'border-red-400' : 'border-blue-200'}`}
                  placeholder="Crea una contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-700 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-blue-900 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${formErrors.password_confirmation ? 'border-red-400' : 'border-blue-200'}`}
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-700 focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
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
