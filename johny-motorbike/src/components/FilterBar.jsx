import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import RangeSlider from './RangeSlider';
import RatingStarsFilter from './RatingStarsFilter';
import CountrySelect from './CountrySelect';
import IconSelector from './IconSelector';
import { difficultyIcons } from './RouteIcons';

/**
 * Componente para filtrar y buscar rutas
 * @param {Object} props
 * @param {Function} props.onFilterChange - Función a ejecutar cuando cambian los filtros
 */
const FilterBar = ({ onFilterChange }) => {
  const { landscapes, terrains, difficulties, countries } = useAppContext();
    // Constantes para valores máximos
  const MAX_DISTANCE = 999; // 500+ km (filtro abierto)
  const MAX_DURATION = 480; // 480+ minutos (8 horas) (filtro abierto)
  
  // Estados para cada tipo de filtro
  const [isExpanded, setIsExpanded] = useState(false);
  const [distanceRange, setDistanceRange] = useState([0, MAX_DISTANCE]);
  const [durationRange, setDurationRange] = useState([0, MAX_DURATION]); // en minutos (8 horas max)
  const [selectedLandscapes, setSelectedLandscapes] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedTerrains, setSelectedTerrains] = useState([]);
  const [ratingMin, setRatingMin] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchText, setSearchText] = useState('');
    // Aplicar filtros cuando cambie cualquier valor
  useEffect(() => {
    // Crear objeto de filtros
    const filters = {
      distance: distanceRange,
      duration: durationRange,
      landscapes: selectedLandscapes,
      difficulties: selectedDifficulties,
      terrains: selectedTerrains,
      rating: ratingMin,
      countries: selectedCountries,
      searchText
    };
    
    // Pasar filtros al componente padre
    // Usamos setTimeout para romper el ciclo sincrónico de actualizaciones
    const timerId = setTimeout(() => {
      onFilterChange(filters);
    }, 0);
    
    // Limpieza del timeout si el componente se desmonta o los filtros cambian de nuevo
    return () => clearTimeout(timerId);
  }, [
    distanceRange, 
    durationRange, 
    selectedLandscapes, 
    selectedDifficulties, 
    selectedTerrains, 
    ratingMin,
    selectedCountries,
    searchText
  ]); // Eliminamos onFilterChange de las dependencias
  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setDistanceRange([0, MAX_DISTANCE]); // Restablecer a filtro abierto
    setDurationRange([0, MAX_DURATION]); // Restablecer a filtro abierto
    setSelectedLandscapes([]);
    setSelectedDifficulties([]);
    setSelectedTerrains([]);
    setRatingMin(0);
    setSelectedCountries([]);
    setSearchText('');
  };
  
  // Manejador para seleccionar/deseleccionar items
  const toggleItem = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  // Utilizamos el componente RangeSlider importado en lugar de definirlo aquí
  // Componente para filtros de selección múltiple con iconos
  const MultiSelect = ({ title, items, selectedItems, toggleItem }) => {
    // Usar difficultyIcons para el título "Dificultad"
    const usesIcons = title === 'Dificultad';
    const icons = usesIcons ? difficultyIcons : null;

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">{title}</label>
        <div className="flex flex-wrap gap-4">
          {items && items.map((item) => {
            // Obtener el icono si estamos usando iconos
            const Icon = usesIcons && icons[item.name] ? icons[item.name] : null;
            
            return usesIcons ? (
              // Versión con iconos (estilo similar a IconSelector)
              <div key={item.id} className="flex flex-col items-center mb-2">
                <button
                  onClick={() => toggleItem(item.id, selectedItems, (newSelected) => {
                    setSelectedDifficulties(newSelected);
                  })}
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
            ) : (
              // Versión normal con texto para otros tipos
              <button
                key={item.id}
                onClick={() => toggleItem(item.id, selectedItems, (newSelected) => {
                  switch (title) {
                    case 'Paisaje':
                      setSelectedLandscapes(newSelected);
                      break;
                    case 'Dificultad':
                      setSelectedDifficulties(newSelected);
                      break;
                    case 'Terreno':
                      setSelectedTerrains(newSelected);
                      break;
                    case 'País':
                      setSelectedCountries(newSelected);
                      break;
                  }
                })}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  selectedItems.includes(item.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };// Ya no necesitamos definir RatingFilter aquí ya que usamos el componente importado

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Filtrar rutas</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpiar filtros
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {isExpanded ? (
              <>
                <span>Mostrar menos</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            ) : (
              <>
                <span>Mostrar más</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Búsqueda por texto - siempre visible */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre o descripción</label>
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Ej: montaña, río, bosque..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filtros expandibles */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>            <RangeSlider
              min={0}
              max={MAX_DISTANCE}
              value={distanceRange}
              onChange={setDistanceRange}
              title="Distancia"
              unit="km"
            />

            <RangeSlider
              min={0}
              max={MAX_DURATION}
              value={durationRange}
              onChange={setDurationRange}
              title="Duración"
              unit="min"
            />

            <RatingStarsFilter 
              rating={ratingMin}
              onChange={setRatingMin}
            />
          </div>

          <div>
              <IconSelector
              title="Paisaje"
              items={landscapes}
              selectedItems={selectedLandscapes}
              onItemToggle={(itemId) => toggleItem(itemId, selectedLandscapes, setSelectedLandscapes)}
            />

            <MultiSelect
              title="Dificultad"
              items={difficulties}
              selectedItems={selectedDifficulties}
              toggleItem={toggleItem}
            />

            <IconSelector
              title="Terreno"
              items={terrains}
              selectedItems={selectedTerrains}
              onItemToggle={(itemId) => toggleItem(itemId, selectedTerrains, setSelectedTerrains)}
            />
              <CountrySelect
              countries={countries}
              selectedCountries={selectedCountries}
              onChange={setSelectedCountries}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
