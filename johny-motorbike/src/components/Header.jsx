import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import HelmetIcon from '../assets/helmet-favicon.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

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

  // Determinar si el header debe ser transparente (solo en la página de inicio y cuando no hay scroll)
  const isTransparent = isHomePage && !isScrolled

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white shadow-lg'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center">
                <img src={HelmetIcon} alt="Logo" className={`h-8 w-8 ${isTransparent ? 'opacity-100' : 'opacity-80'}`} />
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
              </NavLink>
              
              <NavLink 
                to="/nueva-ruta"
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
                Crear Ruta
              </NavLink>
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
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`} 
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
          </NavLink>
          
          <NavLink 
            to="/nueva-ruta" 
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Crear Ruta
          </NavLink>
        </div>
      </div>
    </header>
  )
}