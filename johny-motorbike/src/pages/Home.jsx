import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useMemo } from 'react'
import backgroundImage from '../assets/johny-motorbike.jpg'
import { motion } from 'framer-motion'


import RutaCard from '../components/RutaCard'

export default function Home() {
  const { routes, loading, user, showAuthRequiredModal } = useAppContext()
  
  // Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
  
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }
  
  const speedEffect = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }
  
  const zoomIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  }
  
  const slideIn = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }
  
  // Obtener las 3 rutas mejor puntuadas (ordenadas por rating de mayor a menor)
  const popularRoutes = useMemo(() => {
    // Crear una copia de las rutas para no modificar el array original
    const sortedRoutes = [...routes]
      // Calcular rating para cada ruta
      .map(route => ({
        ...route,
        calculatedRating: route.totalScore && route.countScore ? route.totalScore / route.countScore : 0
      }))
      // Ordenar por rating de mayor a menor
      .sort((a, b) => b.calculatedRating - a.calculatedRating)
      // Tomar las 3 primeras
      .slice(0, 3);
    
    return sortedRoutes;
  }, [routes]);
  return (
    <>      {/* Hero Section con fondo de imagen */}
      <section className="relative h-screen flex items-center bg-cover bg-center overflow-hidden" 
        style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        ></motion.div>
        
        <motion.div 
          className="container mx-auto px-4 z-10 pt-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}>
          <div className="max-w-2xl">
            <motion.h1 
              className="text-5xl font-bold mb-6 text-white leading-tight"
              variants={speedEffect}
            >
              Explora el Mundo en Dos Ruedas
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-100"
              variants={fadeInUp}
            >
              Descubre las mejores rutas para tus aventuras en moto y comparte tus experiencias con otros apasionados.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={fadeInUp}
            >
              <Link 
                to="/rutas" 
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 hover:scale-105 transform"
              >
                Ver todas las rutas
              </Link>
              <Link 
                to="/nueva-ruta"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    showAuthRequiredModal();
                  }
                }} 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-800 px-6 py-3 rounded-lg font-semibold transition duration-300 hover:scale-105 transform"
              >
                Crear nueva ruta
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2">Desliza para explorar</span>
            <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </section>      {/* Sección de Por Qué Johny Motorbike */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-blue-800"
              variants={fadeInUp}
            >
              Descubre el Paraíso de los Moteros
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition duration-300"
                variants={slideIn}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <motion.div 
                  className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-700"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Rutas Verificadas</h3>
                <p className="text-gray-600 mb-4">
                  Todas nuestras rutas son creadas y verificadas por moteros apasionados que conocen los mejores caminos y rincones.
                </p>
                <Link to="/rutas" className="text-blue-700 font-semibold hover:text-blue-900 flex items-center group">
                  Explorar rutas
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </Link>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition duration-300"
                variants={slideIn}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <motion.div 
                  className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-700"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Planifica Todo</h3>
                <p className="text-gray-600 mb-4">
                  Encuentra paradas, gasolineras, alojamientos y restaurantes recomendados para tus viajes en moto.
                </p>
                <Link to="/nueva-ruta" className="text-blue-700 font-semibold hover:text-blue-900 flex items-center group">
                  Planificar ruta
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
        {/* Sección de Tipo de Rutas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4 text-center text-blue-800"
              variants={fadeInUp}
            >
              Encuentra Tu Tipo de Ruta Perfecta
            </motion.h2>
            <motion.p 
              className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              En Johny Motorbike encontrarás rutas para todos los gustos y niveles de experiencia
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border-t-4 border-red-600"
                variants={zoomIn}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Rutas de Montaña</h3>
                <p className="text-gray-600 mb-4">
                  Curvas, paisajes impresionantes y carreteras sinuosas con vistas panorámicas que te dejarán sin aliento.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dificultad: Alta-Extrema
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border-t-4 border-blue-600"
                variants={zoomIn}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Rutas Costeras</h3>
                <p className="text-gray-600 mb-4">
                  Disfruta del mar, acantilados y pueblos marineros mientras recorres las carreteras junto al litoral.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dificultad: Fácil-Moderada
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border-t-4 border-green-600"
                variants={zoomIn}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Rutas Rurales</h3>
                <p className="text-gray-600 mb-4">
                  Atraviesa pueblos con encanto, carreteras secundarias y paisajes campestres llenos de tranquilidad.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dificultad: Fácil
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border-t-4 border-yellow-600"
                variants={zoomIn}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Grandes Travesías</h3>
                <p className="text-gray-600 mb-4">
                  Viajes de largo recorrido con variedad de terrenos, perfectas para escapadas de varios días.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dificultad: Variable
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
        {/* Sección de Cómo Funciona */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4 text-center text-blue-800"
              variants={fadeInUp}
            >
              Cómo Funciona Johny Motorbike
            </motion.h2>
            <motion.p 
              className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Una plataforma creada por y para moteros que facilita descubrir y compartir las mejores rutas
            </motion.p>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.img 
                  src="https://www.vikingbags.com/cdn/shop/articles/best-motorcycle-trip-planner-apps-for-a-long-road-trip.jpg?v=1743163580&width=2048" 
                  alt="Planificando una ruta en moto" 
                  className="rounded-lg shadow-lg w-full"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start"
                    variants={speedEffect}
                    custom={1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <motion.div 
                      className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-700 font-bold mr-4 shrink-0"
                      whileHover={{ scale: 1.2, backgroundColor: "#3B82F6", color: "white" }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      1
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Explora el Mapa</h3>
                      <p className="text-gray-600">
                        Utiliza nuestro mapa interactivo para descubrir rutas cerca de ti o en los destinos que quieras visitar.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    variants={speedEffect}
                    custom={2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <motion.div 
                      className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-700 font-bold mr-4 shrink-0"
                      whileHover={{ scale: 1.2, backgroundColor: "#3B82F6", color: "white" }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      2
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Planifica tu Viaje</h3>
                      <p className="text-gray-600">
                        Revisa los detalles de cada ruta: distancia, duración, dificultad, puntos de interés y opiniones de otros moteros.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    variants={speedEffect}
                    custom={3}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <motion.div 
                      className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-700 font-bold mr-4 shrink-0"
                      whileHover={{ scale: 1.2, backgroundColor: "#3B82F6", color: "white" }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      3
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Vive la Experiencia</h3>
                      <p className="text-gray-600">
                        Disfruta de la ruta con toda la información necesaria y la seguridad de seguir un camino probado por otros motociclistas.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    variants={speedEffect}
                    custom={4}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  >
                    <motion.div 
                      className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-700 font-bold mr-4 shrink-0"
                      whileHover={{ scale: 1.2, backgroundColor: "#3B82F6", color: "white" }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      4
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Comparte y Contribuye</h3>
                      <p className="text-gray-600">
                        Después de tu viaje, comparte tus experiencias, fotos y valora la ruta para ayudar a otros moteros.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>{/* Sección de Beneficios con Estadísticas */}
      <section className="py-16 bg-blue-800 text-white">
        <motion.div
          initial={{ background: "linear-gradient(90deg, #1E40AF 0%, #2563EB 100%)" }}
          whileInView={{ background: "linear-gradient(90deg, #1E3A8A 0%, #1E40AF 100%)" }}
          transition={{ duration: 1.5 }}
          className="py-16 relative overflow-hidden"
        >
          <motion.div 
            className="absolute top-0 left-0 w-full h-10 bg-gradient-to-r from-blue-400/20 to-transparent"
            animate={{ 
              x: ["0%", "100%"],
              opacity: [0.2, 0.5, 0.2] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "linear"
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl font-bold mb-6 text-center"
                variants={fadeInUp}
              >
                Por Qué Elegir Johny Motorbike
              </motion.h2>
              <motion.p 
                className="text-xl text-center mb-12 max-w-3xl mx-auto text-blue-100"
                variants={fadeInUp}
              >
                La comunidad de motociclistas está creciendo y Johny Motorbike está aquí para ayudarte a sacar el máximo provecho de tus viajes
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div 
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="text-4xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{
                      opacity: 1,
                      scale: [0.5, 1.2, 1],
                      transition: { duration: 0.8, ease: "easeOut", delay: 0.1 }
                    }}
                    viewport={{ once: true }}
                  >
                    200+
                  </motion.div>
                  <div className="text-xl text-blue-200 mb-3">Rutas Disponibles</div>
                  <p className="text-blue-100">
                    Miles de rutas verificadas en toda España y Europa, con nuevas rutas añadidas cada semana.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="text-4xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{
                      opacity: 1,
                      scale: [0.5, 1.2, 1],
                      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
                    }}
                    viewport={{ once: true }}
                  >
                    15,000+
                  </motion.div>
                  <div className="text-xl text-blue-200 mb-3">Usuarios Activos</div>
                  <p className="text-blue-100">
                    Una comunidad en constante crecimiento de apasionados motociclistas compartiendo experiencias.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="text-4xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{
                      opacity: 1,
                      scale: [0.5, 1.2, 1],
                      transition: { duration: 0.8, ease: "easeOut", delay: 0.5 }
                    }}
                    viewport={{ once: true }}
                  >
                    98%
                  </motion.div>
                  <div className="text-xl text-blue-200 mb-3">Valoraciones Positivas</div>
                  <p className="text-blue-100">
                    Nuestros usuarios confían en la calidad de la información y la precisión de nuestras rutas.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="text-4xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{
                      opacity: 1,
                      scale: [0.5, 1.2, 1],
                      transition: { duration: 0.8, ease: "easeOut", delay: 0.7 }
                    }}
                    viewport={{ once: true }}
                  >
                    5.000 km
                  </motion.div>
                  <div className="text-xl text-blue-200 mb-3">Kilómetros Mapeados</div>
                  <p className="text-blue-100">
                    Carreteras y caminos de toda España detalladamente documentados para tu aventura.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute bottom-0 right-0 w-full h-16 bg-gradient-to-l from-blue-400/20 to-transparent"
            animate={{ 
              x: ["100%", "-100%"],
              opacity: [0.2, 0.5, 0.2] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "linear"
            }}
          />
        </motion.div>
      </section>
      
      {/* Sección de Testimonios */}
      <section className="py-16 bg-gray-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-blue-800"
              variants={fadeInUp}
            >
              Lo Que Dicen Nuestros Usuarios
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4"
                    whileHover={{ scale: 1.1, backgroundColor: "#2563EB", color: "white" }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    CM
                  </motion.div>
                  <div>
                    <h4 className="font-semibold">Carlos Martínez</h4>
                    <p className="text-sm text-gray-500">GS 1250 Adventure</p>
                  </div>
                </div>
                <motion.div 
                  className="flex mb-3 text-yellow-500"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <motion.svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      variants={{
                        hidden: { opacity: 0, scale: 0.5 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </motion.div>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  "Johny Motorbike ha cambiado la forma en que planeo mis rutas. Gracias a las recomendaciones de otros usuarios, he descubierto caminos increíbles que nunca hubiera encontrado por mi cuenta."
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4"
                    whileHover={{ scale: 1.1, backgroundColor: "#2563EB", color: "white" }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    LR
                  </motion.div>
                  <div>
                    <h4 className="font-semibold">Laura Rodríguez</h4>
                    <p className="text-sm text-gray-500">Kawasaki Z900</p>
                  </div>
                </div>
                <motion.div 
                  className="flex mb-3 text-yellow-500"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      variants={{
                        hidden: { opacity: 0, scale: 0.5 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </motion.div>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  "La aplicación es perfecta para encontrar rutas adecuadas a mi nivel. Como mujer motociclista, me encanta poder filtrar por nivel de dificultad y encontrar grupos para no viajar sola."
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4"
                    whileHover={{ scale: 1.1, backgroundColor: "#2563EB", color: "white" }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    JG
                  </motion.div>
                  <div>
                    <h4 className="font-semibold">Javier González</h4>
                    <p className="text-sm text-gray-500">Ducati Monster 821</p>
                  </div>
                </div>                <motion.div 
                  className="flex mb-3 text-yellow-500"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <motion.svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      variants={{
                        hidden: { opacity: 0, scale: 0.5 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </motion.div>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  "Lo mejor de Johny Motorbike son las recomendaciones de paradas en ruta. He encontrado restaurantes y miradores increíbles que hacen que cada viaje sea especial."
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
        {/* Sección de Llamada a la Acción */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white relative overflow-hidden"
        initial={{ background: "linear-gradient(90deg, #1E40AF 0%, #2563EB 100%)" }}
        whileInView={{ background: "linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%)" }}
        transition={{ duration: 1.5 }}
      >
        {/* Elemento de animación de fondo */}
        <motion.div 
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
          animate={{ 
            backgroundPosition: ["0px 0px", "100px 100px"] 
          }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "mirror", 
            duration: 10,
            ease: "linear"
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold mb-6"
              variants={fadeInUp}
            >
              ¿Listo para Descubrir Nuevas Aventuras?
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Únete a nuestra comunidad y comienza a explorar las mejores rutas en moto hoy mismo. 
              Compartir tus experiencias nunca ha sido tan fácil.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={fadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/rutas" 
                  className="px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 inline-block"
                >
                  Explorar Rutas
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/nueva-ruta"
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      showAuthRequiredModal();
                    }
                  }} 
                  className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 rounded-lg font-semibold transition duration-300 inline-block"
                >
                  Crear Mi Ruta
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Elementos decorativos animados */}
        <motion.div 
          className="absolute w-20 h-20 rounded-full bg-white opacity-10 -top-10 -left-10"
          animate={{ 
            y: [0, 100, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div 
          className="absolute w-16 h-16 rounded-full bg-white opacity-10 bottom-10 right-20"
          animate={{ 
            y: [0, -80, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.section>
        {/* Sección de rutas mejor valoradas */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        {/* Fondo animado */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-100 to-transparent opacity-70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4 text-center text-blue-800"
              variants={fadeInUp}
            >
              Mejores Rutas
            </motion.h2>
            
            <motion.div 
              className="w-24 h-1 bg-blue-600 mx-auto mb-12"
              variants={{
                hidden: { width: 0 },
                visible: { 
                  width: 96,
                  transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
                }
              }}
            />
          
            {loading ? (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >              
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mx-auto"></div>
                <p className="mt-4 text-gray-700">Cargando las mejores rutas...</p>
              </motion.div>
            ) : (
              <>
                {popularRoutes.length === 0 ? (
                  <motion.p 
                    className="text-center text-gray-600 py-8"
                    variants={fadeInUp}
                  >
                    No hay rutas disponibles actualmente. ¡Sé el primero en crear una!
                  </motion.p>
                ) : (                
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {popularRoutes.map((ruta, index) => (
                      <motion.div 
                        key={ruta.id} 
                        className="relative"
                        variants={fadeInUp}
                        custom={index}
                        whileHover={{ 
                          y: -10,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {/* Medallero para las top 3 rutas */}
                        <motion.div 
                          className="absolute -top-4 -right-4 z-10"
                          initial={{ scale: 0, rotate: -45 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20,
                            delay: 0.5 + (index * 0.2)
                          }}
                          viewport={{ once: true }}
                        >
                          <motion.div 
                            className={`w-16 h-16 flex items-center justify-center rounded-full shadow-lg border-2 
                              ${index === 0 ? 'bg-yellow-500 border-yellow-600' : 
                                index === 1 ? 'bg-gray-300 border-gray-400' : 
                                'bg-amber-700 border-amber-800'}`}
                            whileHover={{ 
                              scale: 1.1,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                            }}
                          >
                            <div className="text-white font-bold text-xl">
                              #{index + 1}
                            </div>
                          </motion.div>
                        </motion.div>
                        
                        {/* Tarjeta de la ruta con efecto de profundidad */}
                        <motion.div
                          whileHover={{ 
                            boxShadow: "0 25px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <RutaCard key={ruta.id} ruta={ruta} className="h-full" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <motion.div 
                  className="mt-10 text-center"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link 
                      to="/rutas" 
                      className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                      Ver todas las rutas
                    </Link>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
        
        {/* Elementos decorativos animados */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-200 to-transparent opacity-30"
          animate={{ 
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </section>
    </>
  )
}