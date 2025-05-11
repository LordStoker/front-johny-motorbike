
import PropTypes from 'prop-types';

/**
 * Componente para mostrar una calificación con estrellas (1-5)
 * Soporta estrellas completas, medias estrellas y estrellas vacías
 * 
 * @param {Object} props
 * @param {number} props.rating - Calificación a mostrar (entre 0 y 5)
 * @param {string} props.className - Clases adicionales para estilizar el contenedor
 * @param {string} props.size - Tamaño de las estrellas ('sm', 'md', 'lg')
 * @param {boolean} props.showValue - Indica si se debe mostrar el valor numérico junto a las estrellas
 */
const StarRating = ({ rating = 0, className = '', size = 'sm', showValue = true }) => {
  // Aseguramos que el rating esté entre 0 y 5
  const safeRating = Math.min(5, Math.max(0, rating));
  
  // Determinamos cuántas estrellas de cada tipo mostrar
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Clases según el tamaño deseado
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const starSize = starSizes[size] || starSizes.sm;
  
  // Colores para las estrellas
  const starActiveColor = 'text-yellow-400';
  const starInactiveColor = 'text-gray-300';
    return (
    <div className={`flex items-center gap-0.5 sm:gap-1 ${className}`}>{/* Estrellas completas */}
      {[...Array(fullStars)].map((_, i) => (
        <svg 
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg" 
          className={`${starSize} ${starActiveColor} transition-transform duration-200 hover:scale-110`} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
        </svg>
      ))}
        {/* Media estrella si es necesario */}      {hasHalfStar && (
        <div className="relative transition-transform duration-200 hover:scale-110">
          {/* Estrella gris de fondo */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${starSize} ${starInactiveColor}`}
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
          
          {/* Media estrella amarilla encima */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`${starSize} ${starActiveColor}`}
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
            </svg>
          </div>
        </div>
      )}
        {/* Estrellas vacías */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg 
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg" 
          className={`${starSize} ${starInactiveColor} transition-transform duration-200 hover:scale-110`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
        </svg>
      ))}
        {/* Mostrar el valor numérico de la calificación si showValue es true */}
      {showValue && (
        <span className="ml-1 text-sm text-gray-600">
          {safeRating ? safeRating.toFixed(1) : '-'}
        </span>
      )}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showValue: PropTypes.bool
};

export default StarRating;
