import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
        <div className="logo">
          <Link to="/">Perfumería Oasis Deluxe</Link>
        </div>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/decants" onClick={() => setMenuOpen(false)}>Decants</Link></li>
          <li><Link to="/marcas" onClick={() => setMenuOpen(false)}>Marcas</Link></li>
          <li><Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link></li>
        </ul>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </nav>
    </header>
  );
}

export default Header;



