import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import HelmetIcon from '../assets/helmet-favicon.png'
import { useAppContext } from '../context/AppContext'

export default function Header() {  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { user, logout, showNotification, showAuthRequiredModal } = useAppContext()
  const navigate = useNavigate()

  // Estado para el dropdown de login/registro
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Estado para el menú desplegable del usuario
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  // Referencia para el menú desplegable del usuario (para cerrar al hacer clic fuera)
  const userMenuRef = useRef(null)

  // Efecto para detectar el scroll y cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    if (!isDropdownOpen) return
    const handleClick = (e) => {
      if (!document.getElementById('dropdown-acceder')?.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isDropdownOpen])

  // Cerrar el menú de usuario al hacer clic fuera
  useEffect(() => {
    if (!isUserMenuOpen) return
    const handleClick = (e) => {
      if (!userMenuRef.current?.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isUserMenuOpen])

  // Determinar si el header debe ser transparente (solo en la página de inicio y cuando no hay scroll)
  const isTransparent = isHomePage && !isScrolled  // Función para manejar logout
  const handleLogout = () => {
    // Obtenemos el nombre del usuario para personalizar el mensaje
    const userName = user?.name || '';
    
    // Primero ejecutamos el logout para cerrar la sesión
    logout()
    
    // Cerramos los menús
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
    
    // Mostrar mensaje de éxito usando el sistema de notificaciones
    showNotification(`¡Hasta pronto${userName ? `, ${userName}` : ''}! Has cerrado sesión correctamente.`, 'success', 2500)
    
    // Retrasamos la navegación para mostrar el mensaje
    setTimeout(() => {
      navigate('/')
    }, 2500)
  }

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white shadow-lg'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
                <img src={HelmetIcon} alt="Logo" className={`h-8 w-8 mr-2 ${isTransparent ? 'opacity-100' : 'opacity-80'}`} />
              <span className={`self-center text-lg font-semibold whitespace-nowrap ${isTransparent ? 'text-white' : 'text-blue-800'}`}>
                Johny Motorbike
              </span>
            </NavLink>
          </div>
          
          {/* Menú de navegación en escritorio */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink 
                to="/"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : isTransparent
                        ? 'text-white hover:bg-blue-700/30'
                        : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                Inicio
              </NavLink>
              
              <NavLink 
                to="/rutas"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : isTransparent
                        ? 'text-white hover:bg-blue-700/30'
                        : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                Rutas
              </NavLink>              {/* NavLink modificado para mostrar modal si el usuario no está autenticado */}
              <NavLink 
                to="/nueva-ruta"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    showAuthRequiredModal();
                  }
                }}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    (isActive && user) 
                      ? 'bg-blue-700 text-white' 
                      : isTransparent
                        ? 'text-white hover:bg-blue-700/30'
                        : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                Crear Ruta
              </NavLink>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isTransparent 
                        ? 'text-white hover:bg-blue-700/30' 
                        : 'text-blue-800 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">Hola {user.name}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in ">
                      <NavLink
                        to="/perfil"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Mi Perfil
                        </div>
                      </NavLink>
                        <NavLink
                        to="/cambiar-password"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Cambiar Contraseña
                        </div>
                      </NavLink>
                        <NavLink
                        to="/favoritos"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Rutas Favoritas
                        </div>
                      </NavLink>
                      
                      <NavLink
                        to="/mis-rutas"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Rutas personalizadas
                        </div>
                      </NavLink>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 border-t border-gray-200"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Cerrar sesión
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" id="dropdown-acceder">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${isTransparent ? 'border-white text-white hover:bg-white hover:text-blue-800' : 'border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white'}`}
                  >
                    Acceder
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-white border border-blue-100 rounded-lg shadow-lg z-50 animate-fade-in">
                      <NavLink
                        to="/login"
                        className="block px-4 py-2 text-blue-800 hover:bg-blue-50 hover:text-blue-900 rounded-t-lg"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Iniciar sesión
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="block px-4 py-2 text-blue-800 hover:bg-blue-50 hover:text-blue-900 rounded-b-lg"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Registrarse
                      </NavLink>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Botón de menú móvil */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isTransparent ? 'text-white hover:bg-blue-700/30' : 'text-gray-700 hover:bg-gray-200'
              }`}
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono cuando está cerrado */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`} 
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </NavLink>
          
          <NavLink 
            to="/rutas" 
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Rutas
          </NavLink>          <NavLink 
            to="/nueva-ruta"
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                (isActive && user) ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`
            }
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                showAuthRequiredModal();
              }
              setIsMenuOpen(false);
            }}
          >
            Crear Ruta
          </NavLink>

          {user ? (
            <>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <p className="px-3 py-1 text-sm font-medium text-blue-800">
                  Perfil de {user.name}
                </p>
                <NavLink
                  to="/perfil"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                  </div>
                </NavLink>                <NavLink
                  to="/cambiar-password"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Cambiar Contraseña
                  </div>
                </NavLink>                <NavLink
                  to="/favoritos"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Mis Rutas Favoritas
                  </div>
                </NavLink>
                <NavLink
                  to="/mis-rutas"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Mis Rutas
                  </div>
                </NavLink>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700 mt-2"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </div>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-800 hover:bg-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar sesión
              </NavLink>
              <NavLink
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-800 border border-blue-800 mt-1 hover:bg-blue-800 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}