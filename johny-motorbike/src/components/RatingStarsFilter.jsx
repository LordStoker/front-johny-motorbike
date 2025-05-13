

/**
 * Componente para filtrar por valoración con estrellas
 * @param {Object} props
 * @param {number} props.rating - Valor actual de la valoración mínima (0-5)
 * @param {Function} props.onChange - Función al cambiar el valor
 */
const RatingStarsFilter = ({ rating = 0, onChange }) => {
  const ratings = [0, 1, 2, 3, 4, 5];
    
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Valoración mínima</label>
      <div className="flex gap-2">
        {ratings.map((value) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`w-auto h-8 px-3 flex items-center justify-center rounded-full transition-all ${
              rating === value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {value === 0 ? (
              'Todos'
            ) : (
              <div className="flex items-center">
                <span>{value}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4 ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingStarsFilter;
