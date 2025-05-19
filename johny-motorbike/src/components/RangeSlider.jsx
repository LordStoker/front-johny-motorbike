import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Componente slider mejorado para seleccionar un rango de valores
 * @param {Object} props
 * @param {number} props.min - Valor mínimo permitido
 * @param {number} props.max - Valor máximo permitido
 * @param {Array<number>} props.value - Valor actual [min, max]
 * @param {Function} props.onChange - Función cuando cambia el valor
 * @param {string} props.title - Título del slider
 * @param {string} props.unit - Unidad de medida (km, min, etc.)
 */
const RangeSlider = ({ min, max, value, onChange, title, unit }) => {
  // Referencias para los sliders
  const minSliderRef = useRef(null);
  const maxSliderRef = useRef(null);
  const isInitialRender = useRef(true);
  
  // Estados locales para manejar los valores
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  
  // Es filtro abierto si el valor máximo es igual al máximo permitido
  const isOpenFilter = maxVal === max;

  // Actualizar los valores cuando cambian las props
  useEffect(() => {
    // Evitamos actualizar el estado en el renderizado inicial para prevenir bucles
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  // Manejar cambios en el slider mínimo - memoizado para evitar recreaciones
  const handleMinChange = useCallback((e) => {
    const newMinVal = Math.min(parseInt(e.target.value), maxVal - 1);
    setMinVal(newMinVal);
    onChange([newMinVal, maxVal]);
  }, [maxVal, onChange]);

  // Manejar cambios en el slider máximo - memoizado para evitar recreaciones
  const handleMaxChange = useCallback((e) => {
    const newMaxVal = Math.max(parseInt(e.target.value), minVal + 1);
    setMaxVal(newMaxVal);
    onChange([minVal, newMaxVal]);
  }, [minVal, onChange]);
  // Efecto de foco cuando se arrastra un slider - solo se ejecuta cuando cambia el estado de arrastre
  useEffect(() => {
    if (isDraggingMin && minSliderRef.current) {
      minSliderRef.current.focus();
    }
    if (isDraggingMax && maxSliderRef.current) {
      maxSliderRef.current.focus();
    }
  }, [isDraggingMin, isDraggingMax]);

  // Función para calcular el porcentaje del valor en el rango - memoizada para prevenir cálculos innecesarios
  const getPercent = useCallback((value) => {
    return Math.round(((value - min) / (max - min)) * 100);
  }, [min, max]);

  // Calcular porcentajes para la visualización del rango - memoizados
  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div className="mb-6">      {/* Título y valores actuales */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{title}</label>
        <div className="relative group">
          <span className={`text-sm ${isOpenFilter ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
            {minVal} - {isOpenFilter ? `${maxVal}+` : maxVal} {unit}
          </span>
          {isOpenFilter && (
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full pointer-events-none w-48 z-10 mb-1">
              {maxVal}+ indica "sin límite superior"
              <svg className="absolute text-gray-800 h-2 w-2 right-3 top-full" viewBox="0 0 255 255">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
              </svg>
            </div>
          )}
        </div>
      </div>      <div className="pt-2 pb-6">
        {/* Slider para el valor mínimo */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Mínimo: {minVal} {unit}</label>
          <div className="relative h-2">
            <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>            <div 
              className="absolute h-2 bg-blue-500 rounded-l-lg pointer-events-none" 
              style={{ width: `${minPercent}%` }}
              data-testid="min-fill-bar"
            ></div>
            <input 
              ref={minSliderRef}
              type="range"
              min={min}
              max={max}
              value={minVal}
              onChange={handleMinChange}
              className="slider-min absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
              style={{ zIndex: 1 }}
              onMouseDown={() => setIsDraggingMin(true)}
              onMouseUp={() => setIsDraggingMin(false)}
              onMouseLeave={() => setIsDraggingMin(false)}
              onTouchStart={() => setIsDraggingMin(true)}
              onTouchEnd={() => setIsDraggingMin(false)}
            />
          </div>
        </div>
        
        {/* Slider para el valor máximo */}
        <div>
          <label className="text-xs text-gray-500 flex justify-between mb-1">
            <span>Máximo: {isOpenFilter ? `${maxVal}+` : maxVal} {unit}</span>
          </label>
          <div className="relative h-2">
            <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
                        {/* Usamos dos divs separados con clases estáticas en lugar de usar clases condicionales */}
            {isOpenFilter ? (
              <div 
                className="absolute h-2 pointer-events-none bg-gradient-to-r from-blue-500 to-green-500 rounded-l-lg" 
                style={{ width: `${maxPercent}%` }}
                data-testid="max-fill-bar-open"
              ></div>
            ) : (
              <div 
                className="absolute h-2 pointer-events-none bg-blue-500 rounded-l-lg" 
                style={{ width: `${maxPercent}%` }}
                data-testid="max-fill-bar"
              ></div>
            )}
            <input 
              ref={maxSliderRef}
              type="range"
              min={min}
              max={max}
              value={maxVal}
              onChange={handleMaxChange}
              className={isOpenFilter ? "slider-max-open absolute w-full h-2 bg-transparent appearance-none cursor-pointer" : "slider-max absolute w-full h-2 bg-transparent appearance-none cursor-pointer"}
              style={{ zIndex: 1 }}
              onMouseDown={() => setIsDraggingMax(true)}
              onMouseUp={() => setIsDraggingMax(false)}
              onMouseLeave={() => setIsDraggingMax(false)}
              onTouchStart={() => setIsDraggingMax(true)}
              onTouchEnd={() => setIsDraggingMax(false)}
            />
          </div>
        </div>
      </div>    
        {/* Estilos personalizados */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Estilos para los sliders */
        input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
          border-radius: 10px;
          background: transparent;
        }
        
        /* Estilos para la barra del slider */
        input[type='range']::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          border-radius: 10px;
          background: transparent;
        }
        
        input[type='range']::-moz-range-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          border-radius: 10px;
          background: transparent;
        }
        
        /* Estilos para el thumb (control deslizante) */
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          cursor: grab;
          margin-top: -8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          z-index: 3;
        }
        
        input[type='range']::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: white;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          cursor: grab;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          z-index: 3;
        }
        
        input[type='range']:active::-webkit-slider-thumb {
          transform: scale(1.2);
          cursor: grabbing;
        }
        
        input[type='range']:active::-moz-range-thumb {
          transform: scale(1.2);
          cursor: grabbing;
        }
        
        /* Estilos para el thumb cuando el filtro está al máximo */
        .slider-max-open::-webkit-slider-thumb {
          border-color: #10b981 !important;
        }
        
        .slider-max-open::-moz-range-thumb {
          border-color: #10b981 !important;
        }
        
        /* Estilo cuando se está arrastrando */
        input[type='range']:focus {
          outline: none;
        }
        
        input[type='range']:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        
        input[type='range']:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}} />
    </div>
  );
};

export default RangeSlider;
