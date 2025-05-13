import { useState } from 'react';
import './IconSelector.css';
import { landscapeIcons, terrainIcons } from './RouteIcons';




/**
 * Componente para selección mediante iconos
 * @param {Object} props
 * @param {string} props.title - Título del selector
 * @param {Array} props.items - Array de objetos con los items disponibles 
 * @param {Array} props.selectedItems - Array con los IDs de los items seleccionados
 * @param {Function} props.onItemToggle - Función para manejar la selección/deselección
 */
const IconSelector = ({ title, items, selectedItems, onItemToggle }) => {  // Este componente usa los iconos centralizados desde RouteIcons.jsx
  
  // Determinar qué conjunto de iconos usar basado en el título
  const icons = title === 'Paisaje' ? landscapeIcons : terrainIcons;  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">{title}</label>
      <div className="flex flex-wrap gap-4">
        {items && items.map((item) => {
          const Icon = icons[item.name] || (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          ); // Icono por defecto si no hay mapeo
            return (
            <div key={item.id} className="flex flex-col items-center mb-2">
              <button
                onClick={() => onItemToggle(item.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 icon-button ${
                  selectedItems.includes(item.id)
                  ? 'bg-blue-600 text-white shadow-md selected'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                data-name={item.name}
                title={item.name}
              >
                <span className="text-2xl">{Icon}</span>
              </button>
              <span className="text-xs mt-1 text-gray-600 text-center">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconSelector;