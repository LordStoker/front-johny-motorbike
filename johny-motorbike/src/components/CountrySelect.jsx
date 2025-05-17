import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './CountrySelect.css';

/**
 * Componente select para países con banderas
 * @param {Object} props
 * @param {Array} props.countries - Lista de países
 * @param {Array} props.selectedCountries - IDs de países seleccionados
 * @param {Function} props.onChange - Función que se ejecuta al cambiar la selección
 */
const CountrySelect = ({ countries, selectedCountries, onChange }) => {
  // Referencia al elemento select
  const selectRef = useRef(null);
  // Estado para controlar el portal del dropdown
  const [portalContainer, setPortalContainer] = useState(null);
  // Estado para controlar la carga de las imágenes de banderas
  const [flagsLoading, setFlagsLoading] = useState({});
  const [flagsError, setFlagsError] = useState({});

  // Efecto para mejorar la visualización de banderas en el select
  useEffect(() => {
    // Esta función se ejecuta después de que el componente se monte
    const customizeSelect = () => {
      // Código que se ejecutará solo en el navegador, no durante la renderización en el servidor
      if (typeof document !== 'undefined') {
        const selectElement = selectRef.current;
        if (selectElement) {
          // Aplicar estilos y comportamientos adicionales si es necesario
          const applyFlagsToOptions = () => {
            const options = selectElement.options;
            for (let i = 0; i < options.length; i++) {
              const option = options[i];
              const flagCode = option.getAttribute('data-flag');
              if (flagCode) {
                // Esto intentará aplicar los estilos en tiempo de ejecución
                option.style.backgroundImage = `url(https://flagcdn.com/16x12/${flagCode}.png)`;
                option.style.backgroundRepeat = 'no-repeat';
                option.style.backgroundPosition = '8px center';
                option.style.paddingLeft = '30px';
                option.style.backgroundSize = '16px 12px';
              }
            }
          };
          
          // Intentar aplicar banderas cuando el select recibe foco
          selectElement.addEventListener('focus', applyFlagsToOptions);
          
          // Limpiar el evento cuando el componente se desmonta
          return () => {
            selectElement.removeEventListener('focus', applyFlagsToOptions);
          };
        }
      }
    };
    
    customizeSelect();
  }, [countries, selectedCountries]); // Dependencias del efecto  // Mapa de códigos de país para mostrar banderas (lista completa de países)
  
  const countryFlags = {
    'Afghanistan': 'af',
    'Albania': 'al',
    'Germany': 'de',
    'Andorra': 'ad',
    'Angola': 'ao',
    'Antigua and Barbuda': 'ag',
    'Saudi Arabia': 'sa',
    'Algeria': 'dz',
    'Argentina': 'ar',
    'Armenia': 'am',
    'Australia': 'au',
    'Austria': 'at',
    'Azerbaijan': 'az',
    'Bahamas': 'bs',
    'Bahrain': 'bh',
    'Bangladesh': 'bd',
    'Barbados': 'bb',
    'Belarus': 'by',
    'Belgium': 'be',
    'Belize': 'bz',
    'Benin': 'bj',  
    'Bhutan': 'bt',
    'Myanmar (Burma)': 'mm',
    'Bolivia': 'bo',
    'Bosnia and Herzegovina': 'ba',
    'Botswana': 'bw',
    'Brazil': 'br',
    'Brunei': 'bn',
    'Bulgaria': 'bg',
    'Burkina Faso': 'bf',
    'Burundi': 'bi',
    'Bután': 'bt',
    'Cabo Verde': 'cv',
    'Cambodia': 'kh',
    'Cameroon': 'cm',
    'Canada': 'ca',
    'Central African Republic': 'cf',
    'Qatar': 'qa',
    'Chad': 'td',
    'Chile': 'cl',
    'China': 'cn',
    'Colombia': 'co',
    'Comoros': 'km',
    'Congo (Congo-Brazzaville)': 'cg',
    'North Korea': 'kp',
    'South Korea': 'kr',
    'Costa de Marfil': 'ci',
    'Costa Rica': 'cr',
    'Croatia': 'hr',
    'Cuba': 'cu',
    'Cyprus': 'cy',
    'Czech Republic': 'cz',
    'Denmark': 'dk',
    'Dominica': 'dm',
    'Ecuador': 'ec',
    'Egypt': 'eg',
    'El Salvador': 'sv',
    'United Arab Emirates': 'ae',
    'Eritrea': 'er',
    'Slovakia': 'sk',
    'Slovenia': 'si',
    'Spain': 'es',
    'United States': 'us',
    'Estonia': 'ee',
    'Ethiopia': 'et',
    'Philippines': 'ph',
    'Finland': 'fi',
    'Fiji': 'fj',
    'France': 'fr',
    'Gabon': 'ga',
    'Gambia': 'gm',
    'Georgia': 'ge',
    'Ghana': 'gh',
    'Grenada': 'gd',
    'Greece': 'gr',
    'Guatemala': 'gt',
    'Guinea': 'gn',
    'Guinea-Bissau': 'gw',
    'Equatorial Guinea': 'gq',
    'Eswatini': 'sz',
    'Guyana': 'gy',
    'Haiti': 'ht',
    'Honduras': 'hn',
    'Hungary': 'hu',
    'India': 'in',
    'Indonesia': 'id',
    'Iraq': 'iq',
    'Iran': 'ir',
    'Ireland': 'ie',
    'Iceland': 'is',
    'Marshall Islands': 'mh',
    'Solomon Islands': 'sb',
    'Israel': 'il',
    'Italy': 'it',
    'Jamaica': 'jm',
    'Japan': 'jp',
    'Jordan': 'jo',
    'Kazakhstan': 'kz',
    'Kenya': 'ke',
    'Kyrgyzstan': 'kg',
    'Kiribati': 'ki',
    'Kuwait': 'kw',
    'Laos': 'la',
    'Lesotho': 'ls',
    'Latvia': 'lv',
    'Lebanon': 'lb',
    'Liberia': 'lr',
    'Libya': 'ly',
    'Liechtenstein': 'li',
    'Lithuania': 'lt',
    'Luxembourg': 'lu',
    'North Macedonia': 'mk',
    'Madagascar': 'mg',
    'Malaysia': 'my',
    'Malawi': 'mw',
    'Maldives': 'mv',
    'Mali': 'ml',
    'Malta': 'mt',
    'Morocco': 'ma',
    'Mauritius': 'mu',
    'Mauritania': 'mr',
    'Mexico': 'mx',
    'Micronesia': 'fm',
    'Moldova': 'md',
    'Monaco': 'mc',
    'Mongolia': 'mn',
    'Montenegro': 'me',
    'Mozambique': 'mz',
    'Namibia': 'na',
    'Nauru': 'nr',
    'Nepal': 'np',
    'Nicaragua': 'ni',
    'Niger': 'ne',
    'Nigeria': 'ng',
    'Norway': 'no',
    'New Zealand': 'nz',
    'Oman': 'om',
    'Netherlands': 'nl',
    'Pakistan': 'pk',
    'Palau': 'pw',
    'Panama': 'pa',
    'Papua New Guinea': 'pg',
    'Paraguay': 'py',
    'Peru': 'pe',
    'Poland': 'pl',
    'Portugal': 'pt',
    'United Kingdom': 'gb',
    'República Centroafricana': 'cf',
    'República Checa': 'cz',
    'Democratic Republic of the Congo': 'cg',
    'República Democrática del Congo': 'cd',
    'Dominican Republic': 'do',
    'Rwanda': 'rw',
    'Romania': 'ro',
    'Russia': 'ru',
    'Samoa': 'ws',
    'Saint Kitts and Nevis': 'kn',
    'San Marino': 'sm',
    'Saint Vincent and the Grenadines': 'vc',
    'Saint Lucia': 'lc',
    'Sao Tome and Principe': 'st',
    'Senegal': 'sn',
    'Serbia': 'rs',
    'Seychelles': 'sc',
    'Sierra Leone': 'sl',
    'Singapore': 'sg',
    'Syria': 'sy',
    'Somalia': 'so',
    'Sri Lanka': 'lk',
    'Suazilandia': 'sz',
    'South Africa': 'za',
    'Sudan': 'sd',
    'South Sudan': 'ss',
    'Sweden': 'se',
    'Switzerland': 'ch',
    'Suriname': 'sr',
    'Thailand': 'th',
    'Taiwan': 'tw',
    'Tanzania': 'tz',
    'Tajikistan': 'tj',
    'Timor-Leste': 'tl',
    'Togo': 'tg',
    'Tonga': 'to',
    'Trinidad and Tobago': 'tt',
    'Tunisia': 'tn',
    'Turkmenistan': 'tm',
    'Turkey': 'tr',
    'Tuvalu': 'tv',
    'Ukraine': 'ua',
    'Uganda': 'ug',
    'Uruguay': 'uy',
    'Uzbekistan': 'uz',
    'Vanuatu': 'vu',
    'Vatican City': 'va',
    'Venezuela': 've',
    'Vietnam': 'vn',
    'Yemen': 'ye',
    'Djibouti': 'dj',
    'Zambia': 'zm',
    'Zimbabwe': 'zw'
  };

  // Obtener el código de bandera para un país dado
  const getFlagCode = (countryName) => {
    return countryFlags[countryName] || 'un'; // 'un' es la bandera de Naciones Unidas (por defecto)
  };

  // Manejar el cambio en el select
  const handleChange = (e) => {
    const countryId = e.target.value;
    if (countryId === '') {
      onChange([]); // Ningún país seleccionado
    } else {
      onChange([parseInt(countryId)]); // Solo un país seleccionado a la vez
    }
  };
  
  // Estado para controlar la apertura del dropdown personalizado
  const [isOpen, setIsOpen] = useState(false);
  // Ref para detectar clics fuera del dropdown y para posicionamiento
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  // Ref para la posición del botón para el dropdown
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0
  });

  // Crear un contenedor para el portal cuando se monte el componente
  useEffect(() => {
    const div = document.createElement('div');
    div.id = 'country-select-portal';
    document.body.appendChild(div);
    setPortalContainer(div);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  // Efecto para cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Efecto para calcular la posición del dropdown cuando se abre
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Obtener el país seleccionado
  const selectedCountry = countries && selectedCountries.length === 1
    ? countries.find(c => c.id === selectedCountries[0])
    : null;
  // Manejador para seleccionar un país
  const handleSelectCountry = (countryId) => {
    if (countryId === '') {

      onChange([]);
    } else {
      const parsedId = parseInt(countryId);

      onChange([parsedId]);
    }
    setIsOpen(false);
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
      <div className="relative country-select-container">
        {/* Botón para mostrar/ocultar el dropdown */}
        <button 
          type="button" 
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)} 
          className="country-select w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between"
        >
          <span>
            {selectedCountry ? selectedCountry.name : 'Todos los países'}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Icono de bandera para el país seleccionado */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {selectedCountries.length === 1 && countries ? (
            <div className="relative mr-2 h-4 w-5">
              {/* Spinner de carga */}
              {flagsLoading[selectedCountries[0]] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div>
                </div>
              )}
              
              {/* Icono de error */}
              {flagsError[selectedCountries[0]] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              )}
              
              <img
                src={`https://flagcdn.com/16x12/${getFlagCode(
                  countries.find(c => c.id === selectedCountries[0])?.name || ''
                )}.png`}
                alt="Bandera de país"
                className={`h-4 w-full object-cover ${flagsLoading[selectedCountries[0]] || flagsError[selectedCountries[0]] ? 'opacity-0' : ''}`}
                onLoad={() => {
                  const newFlagsLoading = {...flagsLoading};
                  newFlagsLoading[selectedCountries[0]] = false;
                  setFlagsLoading(newFlagsLoading);
                }}
                onError={() => {
                  const newFlagsLoading = {...flagsLoading};
                  newFlagsLoading[selectedCountries[0]] = false;
                  setFlagsLoading(newFlagsLoading);
                  
                  const newFlagsError = {...flagsError};
                  newFlagsError[selectedCountries[0]] = true;
                  setFlagsError(newFlagsError);
                }}
              />
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        {/* Dropdown personalizado con banderas usando Portal */}
        {isOpen && portalContainer && createPortal(
          <div 
            ref={dropdownRef}
            className="country-dropdown-portal z-[9999] bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
            style={{
              position: 'absolute',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            <div 
              className="py-1 cursor-pointer hover:bg-gray-100 px-3 flex items-center"
              onClick={() => handleSelectCountry('')}
            >
              <span className="inline-block w-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="ml-2">Todos los países</span>
            </div>
            {countries && countries.map(country => {
              const flagCode = getFlagCode(country.name);
              return (
                <div 
                  key={country.id} 
                  className={`py-1 cursor-pointer hover:bg-gray-100 px-3 flex items-center ${selectedCountries.includes(country.id) ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectCountry(country.id)}
                >
                  {/* Imagen de la bandera con manejo de carga y error */}
                  <div className="relative w-4 h-3 mr-2">
                    {flagsLoading[country.id] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-3 w-3 text-gray-400" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4zm16 0a8 8 0 01-8 8v-4a4 4 0 004-4h4z"></path>
                        </svg>
                      </div>
                    )}
                    <img
                      src={`https://flagcdn.com/16x12/${flagCode}.png`}
                      alt={`Bandera de ${country.name}`}
                      className={`h-3 w-4 object-cover ${flagsError[country.id] ? 'hidden' : ''}`}
                      onLoad={() => setFlagsLoading(prev => ({ ...prev, [country.id]: false }))}
                      onError={() => setFlagsError(prev => ({ ...prev, [country.id]: true }))}
                    />
                  </div>
                  <span className="ml-2">{country.name}</span>
                </div>
              );
            })}
          </div>,
          portalContainer
        )}
        
        {/* Mantenemos el select nativo oculto para compatibilidad con formularios */}
        <select
          id="country-select"
          ref={selectRef}
          value={selectedCountries.length === 1 ? selectedCountries[0] : ''}
          onChange={handleChange}
          className="hidden"
        >
          <option value="">Todos los países</option>
          {countries && countries.map(country => {
            return (
              <option 
                key={country.id} 
                value={country.id}
              >
                {country.name}
              </option>
            );
          })}
        </select>
      </div>
        {/* Estilos adicionales para el dropdown personalizado */}
      <style>{`
        .country-select-container {
          position: relative;
        }
        .country-dropdown {
          max-height: 300px;
          overflow-y: auto;
          z-index: 50;
        }
      `}</style>
    </div>
  );
};

export default CountrySelect;
