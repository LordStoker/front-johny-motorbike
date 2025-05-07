import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const email = query.get('email');

  const { resetPassword, authError, authLoading } = useAppContext();
  
  const [formData, setFormData] = useState({
    email: email || '',
    password: '',
    password_confirmation: '',
    token: token || ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Formato de correo electrónico inválido';
    }
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Confirma tu contraseña';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Las contraseñas no coinciden';
    }
    if (!formData.token) {
      errors.token = 'Token de recuperación no válido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await resetPassword(
        formData.email,
        formData.password,
        formData.password_confirmation,
        formData.token
      );
      
      if (success) {
        setResetSuccess(true);
        // Redirección automática después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    }
  };

  // Si no hay token en la URL, mostrar error
  if (!token && !formData.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-blue-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Enlace inválido</h2>
            <p className="text-gray-700">
              El enlace para restablecer la contraseña no es válido o ha expirado. Por favor, solicita uno nuevo.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/forgot-password"
              className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-blue-100">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-2 tracking-tight drop-shadow-sm">Nueva contraseña</h2>
          <p className="text-gray-500 text-base">
            Restablece tu contraseña para acceder a tu cuenta
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4 text-center animate-pulse">
            {authError}
          </div>
        )}

        {resetSuccess ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">¡Contraseña restablecida!</p>
              <p className="text-sm mt-1">
                Tu contraseña ha sido cambiada con éxito. Serás redirigido a la página de inicio de sesión en unos segundos.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-center transition"
            >
              Ir a iniciar sesión
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
                value={formData.email}
                onChange={handleChange}
                disabled={!!email}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${
                  formErrors.email ? 'border-red-400' : 'border-blue-200'
                } ${email ? 'opacity-70' : ''}`}
                placeholder="ejemplo@email.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-900 mb-1">
                Nueva contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${
                  formErrors.password ? 'border-red-400' : 'border-blue-200'
                }`}
                placeholder="Crea una nueva contraseña"
              />
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-blue-900 mb-1">
                Confirmar nueva contraseña
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`block w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition ${
                  formErrors.password_confirmation ? 'border-red-400' : 'border-blue-200'
                }`}
                placeholder="Repite la contraseña"
              />
              {formErrors.password_confirmation && (
                <p className="mt-1 text-xs text-red-500 font-medium">{formErrors.password_confirmation}</p>
              )}
            </div>

            <input type="hidden" name="token" value={formData.token} />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Volver a inicio de sesión
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Procesando...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}