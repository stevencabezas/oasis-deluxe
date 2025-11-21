import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import '../admin/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar token y cargar usuario
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Verificar token con el backend
    authApi.verify()
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        // Token inválido, redirigir a login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (!user) {
    return <div className="dashboard-loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="dashboard-user">
          <span>Bienvenido, {user.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button onClick={() => navigate('/admin/brands')} className="nav-button">
          📦 Gestionar Marcas
        </button>
        <button onClick={() => navigate('/admin/perfumes')} className="nav-button">
          💎 Gestionar Perfumes
        </button>
        <button onClick={() => navigate('/admin/decants')} className="nav-button">
          🧪 Gestionar Decants
        </button>
        <button onClick={() => navigate('/')} className="nav-button secondary">
          🏠 Ver Sitio Web
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Bienvenido al Panel de Administración</h2>
          <p>Desde aquí puedes gestionar todas las marcas, perfumes y decants de la perfumería.</p>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Marcas</h3>
              <p>Gestiona las marcas disponibles</p>
            </div>
            <div className="stat-card">
              <h3>Perfumes</h3>
              <p>Agrega, edita o elimina perfumes</p>
            </div>
            <div className="stat-card">
              <h3>Decants</h3>
              <p>Administra los decants disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

