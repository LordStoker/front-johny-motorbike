import React from 'react';

/**
 * Componente para mostrar y seleccionar valoraciones con estrellas
 * @param {Object} props
 * @param {number} props.rating - Valor de la calificación (0-5)
 * @param {Function} props.onChange - Función al cambiar el valor (solo si es interactivo)
 * @param {boolean} props.interactive - Si las estrellas son clickeables
 */
const RatingStars = ({ rating = 0, onChange = null, interactive = false }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onChange && onChange(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          disabled={!interactive}
          aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
