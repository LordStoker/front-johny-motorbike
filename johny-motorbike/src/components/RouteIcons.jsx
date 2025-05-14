import { GiMountainRoad, GiLighthouse, GiForest, GiDesertSkull, GiField, GiModernCity, GiRoad } from "react-icons/gi";
import { IoSkullSharp } from "react-icons/io5";

import { LuBaby } from "react-icons/lu";
import { FaHillRockslide } from "react-icons/fa6";
import { AiFillThunderbolt } from "react-icons/ai";
import { BiSolidHot, BiSolidCool } from "react-icons/bi";


/**
 * Mapeo de iconos para tipos de dificultades
 */
export const difficultyIcons = {
  'Fácil': <LuBaby />,
  'Moderada': <AiFillThunderbolt />,
  'Difícil': <BiSolidHot />,
  'Extrema': <IoSkullSharp />
};

/**
 * Mapeo de iconos para tipos de paisajes
 */
export const landscapeIcons = {
  'Montaña': <GiMountainRoad />,
  'Bosque': <GiForest />,
  'Costa': <GiLighthouse />,
  'Desierto': <GiDesertSkull />,
  'Ciudad': <GiModernCity />,
  'Campo': <GiField />
};

/**
 * Mapeo de iconos para tipos de terrenos
 */
export const terrainIcons = {
  'Asfalto': <GiRoad />,
  'Tierra': (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 48 48" id="unpaved-road">
      <path fill="currentColor" fillRule="evenodd" d="M21.8008 12.4012C22.1316 12.8435 22.0412 13.4701 21.5989 13.8009 20.2892 14.7803 19.0491 15.856 17.8892 17.0209 14.7542 20.1695 12.2672 23.9077 10.5703 28.0221 8.87343 32.1365 8 36.5464 8 41.0001 8 41.5523 7.55228 42.0001 7 42.0001 6.44772 42.0001 6 41.5523 6 41.0001 6 36.285 6.92469 31.6159 8.72138 27.2595 10.5181 22.9031 13.1517 18.9445 16.4719 15.6098 17.7004 14.376 19.0139 13.2366 20.4011 12.1992 20.8434 11.8685 21.4701 11.9589 21.8008 12.4012zM25.0958 22.7402L24.3725 23.4307C23.8313 23.9474 23.3107 24.4883 22.8119 25.0515L22.1489 25.8002 20.6517 24.4742 21.3146 23.7256C21.85 23.1211 22.4093 22.5399 22.9915 21.9841L23.7148 21.2935 25.0958 22.7402zM20.6433 27.8088L20.1084 28.6537C19.3093 29.9156 18.6019 31.2489 17.9939 32.6399L17.5934 33.5561 15.7608 32.7551 16.1614 31.8388C16.8095 30.3561 17.5644 28.9327 18.4186 27.5837L18.9536 26.7389 20.6433 27.8088zM16.7568 35.9368L16.4948 36.9019C16.2982 37.6264 16.1268 38.3613 15.9816 39.1047L15.79 40.0862 13.8271 39.7029 14.0187 38.7215C14.1731 37.9307 14.3554 37.149 14.5647 36.3779L14.8267 35.4129 16.7568 35.9368zM31.8488 26.4714C32.1408 26.9401 31.9975 27.5569 31.5288 27.8489 30.5929 28.4319 29.72 29.1019 28.9238 29.8497 27.3584 31.3199 26.1201 33.062 25.2766 34.9746 24.4332 36.887 24 38.9343 24 41.0001 24 41.5524 23.5523 42.0001 23 42.0001 22.4477 42.0001 22 41.5524 22 41.0001 22 38.6536 22.4922 36.3317 23.4467 34.1675 24.4011 32.0036 25.7981 30.0416 27.5547 28.3918 28.448 27.5528 29.4255 26.8028 30.4712 26.1514 30.94 25.8593 31.5567 26.0026 31.8488 26.4714z" clipRule="evenodd"></path>
      <path fill="currentColor" d="M42 7.5C42 8.32843 41.3284 9 40.5 9 39.6716 9 39 8.32843 39 7.5 39 6.67157 39.6716 6 40.5 6 41.3284 6 42 6.67157 42 7.5zM42 12.5C42 13.3284 41.3284 14 40.5 14 39.6716 14 39 13.3284 39 12.5 39 11.6716 39.6716 11 40.5 11 41.3284 11 42 11.6716 42 12.5zM42 17.5C42 18.3284 41.3284 19 40.5 19 39.6716 19 39 18.3284 39 17.5 39 16.6716 39.6716 16 40.5 16 41.3284 16 42 16.6716 42 17.5z"></path>
    </svg>
  ),
  'Gravilla': <FaHillRockslide />,
  'Barro': (
    <svg width="100%" height="100%" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M24 42C26 44 30 43 32 40C34 37 38 36 40 38C42 40 46 38 44 34C42 30 36 29 34 32C32 35 28 36 26 34C24 32 20 34 22 38C23 40 22 41 24 42Z" fill="currentColor"/>
      <path d="M20 24C22 26 26 25 28 22C30 19 34 18 36 20C38 22 42 20 40 16C38 12 32 11 30 14C28 17 24 18 22 16C20 14 16 16 18 20C19 22 18 23 20 24Z" fill="currentColor"/>
    </svg>
  )
};

/**
 * Componente para mostrar un icono de paisaje, terreno o dificultad
 * @param {Object} props
 * @param {string} props.type - Tipo de icono ('landscape', 'terrain' o 'difficulty')
 * @param {string} props.name - Nombre del paisaje, terreno o dificultad
 * @param {string} props.className - Clases adicionales para el contenedor
 * @param {boolean} props.showLabel - Indica si se debe mostrar la etiqueta
 * @param {boolean} props.labelBelow - Indica si la etiqueta se muestra debajo (true) o al lado (false) del icono
 * @param {string} props.size - Tamaño del icono ('sm', 'md', 'lg')
 */
const RouteIcon = ({ 
  type, 
  name, 
  className = '', 
  showLabel = false, 
  labelBelow = false,
  size = 'md' 
}) => {
  if (!name) return null;
  // Mapa de iconos según el tipo
  let iconsMap;
  switch (type) {
    case 'landscape':
      iconsMap = landscapeIcons;
      break;
    case 'terrain':
      iconsMap = terrainIcons;
      break;
    case 'difficulty':
      iconsMap = difficultyIcons;
      break;
    default:
      iconsMap = {}; 
  }
  
  // Obtener el icono correspondiente al nombre
  const Icon = iconsMap[name] || null;
  
  if (!Icon) return null;  // Determinar clases según el tamaño
  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  // Determinar colores según el tipo y nombre
  let bgColorClass = 'bg-gray-100';
  let textColorClass = 'text-gray-800';
  
  if (type === 'difficulty') {
    if (name === 'Fácil') {
      bgColorClass = 'bg-green-100';
      textColorClass = 'text-green-800';
    } else if (name === 'Moderada') {
      bgColorClass = 'bg-yellow-100';
      textColorClass = 'text-yellow-800';
    } else if (name === 'Difícil') {
      bgColorClass = 'bg-red-100';
      textColorClass = 'text-red-800';
    }
    else if (name === 'Extrema') {
      bgColorClass = 'bg-transparent';
      textColorClass = 'text-purple-800';
    }
  }

  // El contenedor principal varía según la posición de la etiqueta
  const containerClasses = labelBelow ? 'flex flex-col items-center' : 'flex items-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full ${bgColorClass} ${textColorClass} p-1 flex items-center justify-center hover:opacity-90 transition-all`}
        title={name}
      >
        {Icon}
      </div>      {showLabel && (
        <span className={`${labelBelow ? 'mt-1 text-center text-xs' : 'ml-2'} ${textColorClass}`}>
          {name}
        </span>
      )}
    </div>
  );
};

export default RouteIcon;
