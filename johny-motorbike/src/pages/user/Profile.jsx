import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function Profile() {
  const { user, updateProfile, authLoading, authError } = useAppContext();
  const navigate = useNavigate();

  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: ''
  });

  // Estado para mensajes
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Cargar datos del usuario cuando cambie
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      });
    } else {
      // Redirigir si no hay usuario autenticado
      navigate('/login');
    }
  }, [user, navigate]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetear mensajes
    setMessage('');
    setMessageType('');

    // Actualizar perfil
    const success = await updateProfile(user.id, formData);
    
    if (success) {
      setMessage('¡Perfil actualizado correctamente!');
      setMessageType('success');
    } else {
      setMessage(authError || 'Error al actualizar el perfil');
      setMessageType('error');
    }

    // Mostrar el mensaje por 3 segundos
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  if (!user) return null; // No renderizar si no hay usuario

  return (
    <div className="min-h-screen pt-20 pb-10 bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Mi Perfil</h1>
        
        {/* Mensaje de éxito o error */}
        {message && (
          <div className={`mb-4 p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu nombre"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu apellido"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu email"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={authLoading}
              className={`inline-flex items-center px-4 py-2 bg-blue-700 border border-transparent rounded-md font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${authLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {authLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </>
              ) : (
                'Actualizar Perfil'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/cambiar-password')}
              className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
