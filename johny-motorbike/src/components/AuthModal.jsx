import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AuthModal() {
  const { showAuthModal, modalVisible, isClosing, closeAuthModal } = useAppContext();

  if (!showAuthModal) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      onClick={(e) => e.target === e.currentTarget && closeAuthModal()}
    >
      <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${modalVisible ? 'opacity-50' : 'opacity-0'}`}></div>
      
      <div 
        className={`bg-white rounded-lg shadow-xl overflow-hidden w-11/12 max-w-md mx-auto transform transition-all duration-300 
          ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
          ${isClosing ? 'animate-modal-out' : ''}`}
      >
        <div className="relative p-6">
          <button 
            onClick={closeAuthModal} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Necesitas iniciar sesión</h3>
            
            <p className="text-gray-600 mb-6">
              Para crear una nueva ruta necesitas iniciar sesión con tu cuenta.
              Si aún no tienes una cuenta, puedes registrarte.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
                onClick={closeAuthModal}
              >
                Iniciar sesión
              </Link>
              
              <Link
                to="/register"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center"
                onClick={closeAuthModal}
              >
                Registrarse
              </Link>
            </div>
            
            <button 
              onClick={closeAuthModal}
              className="mt-6 text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              Continuar explorando sin iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
