import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import '../styles/global.css';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      
      if (isRegister) {
        // Registrar primer usuario
        if (!username || !email || !password) {
          setError('Todos los campos son requeridos');
          setLoading(false);
          return;
        }
        response = await authApi.register(username, email, password);
      } else {
        // Login
        if (!username || !password) {
          setError('Usuario y contraseña son requeridos');
          setLoading(false);
          return;
        }
        response = await authApi.login(username, password);
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirigir al dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? 'Crear Administrador' : 'Iniciar Sesión'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Cargando...' : (isRegister ? 'Registrar' : 'Iniciar Sesión')}
          </button>
        </form>
        
        <div className="login-footer">
          <button 
            type="button" 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="toggle-button"
          >
            {isRegister 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿Primera vez? Crear administrador'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

