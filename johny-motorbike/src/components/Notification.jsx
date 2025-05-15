import { useEffect, useState } from 'react';

const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Aplicar efecto de entrada con un pequeño retraso
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Clases CSS basadas en el tipo de notificación
  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-700';
      case 'error':
        return 'bg-red-500 border-red-700';
      case 'warning':
        return 'bg-yellow-500 border-yellow-700';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-700';
    }
  };

  return (
    <div 
      className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg border-l-4 text-white 
                ${getColorClasses()} 
                transition-all duration-300 ease-in-out transform 
                ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
    >
      <div className="flex items-center">
        {/* Icono basado en tipo */}
        <div className="mr-3">
          {type === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {type === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {type === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        {/* Mensaje */}
        <div className="text-white font-medium">{message}</div>
        
        {/* Botón de cerrar */}
        <button 
          onClick={onClose}
          className="ml-auto text-white hover:text-gray-200 focus:outline-none"
          aria-label="Cerrar notificación"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
