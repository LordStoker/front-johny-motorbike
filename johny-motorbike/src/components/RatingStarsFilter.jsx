import React from 'react';

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
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              rating === value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {value === 0 ? 'Todos' : value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingStarsFilter;
