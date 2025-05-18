import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import UserComments from '../../components/UserComments';
import axios from 'axios';

export default function PublicProfile() {
  const { API_URL } = useAppContext();
  const { userId } = useParams();
  
  // Estado para el usuario
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/users/${userId}/public-profile`);
        
        if (response.data && response.data.success) {
          setUserData(response.data.data);
        } else {
          setError('No se pudo cargar la información del usuario');
        }
      } catch (err) {
        console.error('Error al cargar perfil público:', err);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId, API_URL]);
  
  return (
    <div className="min-h-screen pt-20 pb-10 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <p>{error}</p>
            </div>
          ) : userData ? (
            <>
              <h1 className="text-2xl font-bold text-blue-800 mb-6">Perfil de {userData.name} {userData.last_name}</h1>
              <div className="border-t pt-4 mt-4">
                <Link 
                  to="/rutas" 
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Volver al listado de rutas
                </Link>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No se encontró el usuario</p>
          )}
        </div>
        
        {userData && !loading && !error && (
          <UserComments userId={userId} isPublic={true} />
        )}
      </div>
    </div>
  );
}
