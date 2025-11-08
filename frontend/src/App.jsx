import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Brands from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import Decants from './pages/Decants';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import BrandsManagement from './pages/admin/BrandsManagement';
import PerfumesManagement from './pages/admin/PerfumesManagement';
import DecantsManagement from './pages/admin/DecantsManagement';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas de administración sin Header/Footer */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/brands" element={
            <ProtectedRoute>
              <BrandsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/perfumes" element={
            <ProtectedRoute>
              <PerfumesManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/decants" element={
            <ProtectedRoute>
              <DecantsManagement />
            </ProtectedRoute>
          } />
          
          {/* Rutas públicas con Header y Footer */}
          <Route path="/" element={
            <>
              <Header />
              <main>
                <Home />
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/marcas" element={
            <>
              <Header />
              <main>
                <Brands />
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/marca/:slug" element={
            <>
              <Header />
              <main>
                <BrandDetail />
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/decants" element={
            <>
              <Header />
              <main>
                <Decants />
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/contacto" element={
            <>
              <Header />
              <main>
                <Contact />
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
