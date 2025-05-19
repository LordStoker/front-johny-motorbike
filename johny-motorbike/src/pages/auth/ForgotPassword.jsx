import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function ForgotPassword() {
  const { sendPasswordResetLink, authError, authLoading } = useAppContext();
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Formato de correo electrónico inválido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }; 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const success = await sendPasswordResetLink(email);
        if (success) {
          setSubmitSuccess(true);
        }
      } catch (error) {
        console.error('Error al enviar solicitud:', error);
        
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-blue-100">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-2 tracking-tight drop-shadow-sm">Recuperar contraseña</h2>
          <p className="text-gray-500 text-base">
            Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4 text-center animate-pulse">
            {authError}
          </div>
        )}

        {submitSuccess ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">¡Correo enviado!</p>
              <p className="text-sm mt-1">
                Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-center transition"
            >
              Volver a inicio de sesión
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-900 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${
                  formErrors.email ? 'border-red-400' : 'border-blue-200'
                }`}
                placeholder="ejemplo@email.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.email}</p>
              )}
            </div>            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Volver a inicio de sesión
                </Link>
              </div>
              

            </div><button
              type="submit"
              disabled={authLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}