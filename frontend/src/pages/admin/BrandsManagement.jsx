import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandsApi } from '../../services/api';
import ImageManager from '../../components/ImageManager';
import './Management.css';

function BrandsManagement() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: 'arabes',
    logoUrl: ''
  });

  useEffect(() => {
    // Debouncing: esperar 500ms después de que el usuario deje de escribir
    const delaySearch = setTimeout(() => {
      loadBrands();
    }, 500);

    // Limpiar el timeout si el usuario sigue escribiendo
    return () => clearTimeout(delaySearch);
  }, [searchTerm, showInactive]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (showInactive) params.includeInactive = 'true';
      const response = await brandsApi.getAll(params);
      setBrands(response.data);
    } catch (error) {
      console.error('Error cargando marcas:', error);
      alert('Error al cargar marcas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await brandsApi.update(editingBrand.id, formData);
        alert('Marca actualizada correctamente');
      } else {
        await brandsApi.create(formData);
        alert('Marca creada correctamente');
      }
      setShowForm(false);
      setEditingBrand(null);
      setFormData({ id: '', nombre: '', categoria: 'arabes', logoUrl: '' });
      loadBrands();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al guardar marca');
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      id: brand.brandId,
      nombre: brand.nombre,
      categoria: brand.categoria,
      logoUrl: brand.logoUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta marca?')) return;
    
    try {
      await brandsApi.delete(id);
      alert('Marca eliminada correctamente');
      loadBrands();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar marca');
    }
  };

  const handleActivate = async (id) => {
    try {
      await brandsApi.activate(id);
      alert('Marca activada correctamente');
      loadBrands();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al activar marca');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
    setImageError(false);
    setFormData({ id: '', nombre: '', categoria: 'arabes', logoUrl: '' });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, logoUrl: url });
    setImageError(false);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    setFormData({ ...formData, logoUrl: imageUrl });
    setImageError(false);
    setShowImageManager(false);
  };

  if (loading) {
    return <div className="management-loading">Cargando marcas...</div>;
  }

  return (
    <div className="management-container">
      <button onClick={() => navigate('/admin/dashboard')} className="back-to-dashboard">
        ← Volver al Dashboard
      </button>
      
      <div className="management-header">
        <h2>Gestión de Marcas</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar marcas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <label className="toggle-inactive">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            Mostrar inactivas
          </label>
          <button onClick={() => setShowForm(true)} className="add-button">
            + Nueva Marca
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <h3>{editingBrand ? 'Editar Marca' : 'Nueva Marca'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ID (slug)</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="ej: nueva-marca"
                  required
                  disabled={!!editingBrand}
                />
              </div>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  required
                >
                  <option value="arabes">Árabes</option>
                  <option value="disenador">Diseñador</option>
                  <option value="nichos">Nichos</option>
                </select>
              </div>
              <div className="form-group">
                <label>URL del Logo (opcional)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={handleImageUrlChange}
                    placeholder="/img/logo.png"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageManager(true)}
                    className="gallery-button"
                    title="Abrir galería de imágenes"
                  >
                    🖼️ Galería
                  </button>
                </div>
                <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  La imagen debe estar en la carpeta <code>frontend/public/img/</code>
                </small>
                {formData.logoUrl && (
                  <div className="image-preview">
                    <label>Preview:</label>
                    <img 
                      src={formData.logoUrl}
                      alt="Preview"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        marginTop: '10px',
                        border: imageError ? '2px solid #dc3545' : '2px solid #28a745',
                        borderRadius: '8px',
                        padding: '5px',
                        display: 'block',
                        backgroundColor: '#fff'
                      }}
                    />
                    {imageError && (
                      <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        ⚠️ La imagen no se puede cargar. Verifica la ruta.
                      </span>
                    )}
                    {!imageError && formData.logoUrl && (
                      <span style={{ color: '#28a745', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        ✓ Imagen cargada correctamente
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingBrand ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={handleCancel} className="cancel-button">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className={!brand.activo ? 'inactive-row' : ''}>
                <td>{brand.brandId}</td>
                <td>{brand.nombre}</td>
                <td>{brand.categoria}</td>
                <td>
                  <span className={`status-badge ${brand.activo ? 'active' : 'inactive'}`}>
                    {brand.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(brand)} className="edit-button">
                    Editar
                  </button>
                  {brand.activo ? (
                    <button onClick={() => handleDelete(brand.id)} className="delete-button">
                      Eliminar
                    </button>
                  ) : (
                    <button onClick={() => handleActivate(brand.id)} className="activate-button">
                      Activar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showImageManager && (
        <ImageManager
          currentImageUrl={formData.logoUrl}
          onSelectImage={handleSelectImageFromGallery}
          onClose={() => setShowImageManager(false)}
        />
      )}
    </div>
  );
}

export default BrandsManagement;

