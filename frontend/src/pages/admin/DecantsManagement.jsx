import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decantsApi } from '../../services/api';
import ImageManager from '../../components/ImageManager';
import './Management.css';

function DecantsManagement() {
  const navigate = useNavigate();
  const [decants, setDecants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDecant, setEditingDecant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    precio2ml: '',
    precio5ml: '',
    precio10ml: ''
  });

  useEffect(() => {
    // Debouncing: esperar 500ms después de que el usuario deje de escribir
    const delaySearch = setTimeout(() => {
      loadDecants();
    }, 500);

    // Limpiar el timeout si el usuario sigue escribiendo
    return () => clearTimeout(delaySearch);
  }, [searchTerm, showInactive]);

  const loadDecants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (showInactive) params.includeInactive = 'true';
      const response = await decantsApi.getAll(params);
      setDecants(response.data);
    } catch (error) {
      console.error('Error cargando decants:', error);
      alert('Error al cargar decants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDecant) {
        await decantsApi.update(editingDecant.id, formData);
        alert('Decant actualizado correctamente');
      } else {
        await decantsApi.create(formData);
        alert('Decant creado correctamente');
      }
      setShowForm(false);
      setEditingDecant(null);
      setFormData({ nombre: '', imagen: '', precio2ml: '', precio5ml: '', precio10ml: '' });
      loadDecants();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al guardar decant');
    }
  };

  const handleEdit = (decant) => {
    setEditingDecant(decant);
    setFormData({
      nombre: decant.nombre,
      imagen: decant.imagen,
      precio2ml: decant.precio2ml,
      precio5ml: decant.precio5ml,
      precio10ml: decant.precio10ml
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este decant?')) return;
    
    try {
      await decantsApi.delete(id);
      alert('Decant eliminado correctamente');
      loadDecants();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al eliminar decant');
    }
  };

  const handleActivate = async (id) => {
    try {
      await decantsApi.activate(id);
      alert('Decant activado correctamente');
      loadDecants();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al activar decant');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDecant(null);
    setImageError(false);
    setFormData({ nombre: '', imagen: '', precio2ml: '', precio5ml: '', precio10ml: '' });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imagen: url });
    setImageError(false);
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    setFormData({ ...formData, imagen: imageUrl });
    setImageError(false);
    setShowImageManager(false);
  };

  if (loading) {
    return <div className="management-loading">Cargando decants...</div>;
  }

  return (
    <div className="management-container">
      <button onClick={() => navigate('/admin/dashboard')} className="back-to-dashboard">
        ← Volver al Dashboard
      </button>
      
      <div className="management-header">
        <h2>Gestión de Decants</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar decants..."
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
            Mostrar inactivos
          </label>
          <button onClick={() => setShowForm(true)} className="add-button">
            + Nuevo Decant
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <h3>{editingDecant ? 'Editar Decant' : 'Nuevo Decant'}</h3>
            <form onSubmit={handleSubmit}>
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
                <label>URL de Imagen</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={formData.imagen}
                    onChange={handleImageUrlChange}
                    placeholder="/img/decants/decant.jpg"
                    required
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
                {formData.imagen && (
                  <div className="image-preview">
                    <label>Preview:</label>
                    <img 
                      src={formData.imagen}
                      alt="Preview"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        marginTop: '10px',
                        border: imageError ? '2px solid #dc3545' : '2px solid #28a745',
                        borderRadius: '8px',
                        padding: '5px',
                        display: 'block'
                      }}
                    />
                    {imageError && (
                      <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        ⚠️ La imagen no se puede cargar. Verifica la ruta.
                      </span>
                    )}
                    {!imageError && formData.imagen && (
                      <span style={{ color: '#28a745', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                        ✓ Imagen cargada correctamente
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Precio 2ml</label>
                <input
                  type="number"
                  value={formData.precio2ml}
                  onChange={(e) => setFormData({ ...formData, precio2ml: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Precio 5ml</label>
                <input
                  type="number"
                  value={formData.precio5ml}
                  onChange={(e) => setFormData({ ...formData, precio5ml: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Precio 10ml</label>
                <input
                  type="number"
                  value={formData.precio10ml}
                  onChange={(e) => setFormData({ ...formData, precio10ml: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingDecant ? 'Actualizar' : 'Crear'}
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
              <th>Nombre</th>
              <th>2ml</th>
              <th>5ml</th>
              <th>10ml</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {decants.map((decant) => (
              <tr key={decant.id} className={!decant.activo ? 'inactive-row' : ''}>
                <td>{decant.nombre}</td>
                <td>₡{parseFloat(decant.precio2ml).toLocaleString()}</td>
                <td>₡{parseFloat(decant.precio5ml).toLocaleString()}</td>
                <td>₡{parseFloat(decant.precio10ml).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${decant.activo ? 'active' : 'inactive'}`}>
                    {decant.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(decant)} className="edit-button">
                    Editar
                  </button>
                  {decant.activo ? (
                    <button onClick={() => handleDelete(decant.id)} className="delete-button">
                      Eliminar
                    </button>
                  ) : (
                    <button onClick={() => handleActivate(decant.id)} className="activate-button">
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
          currentImageUrl={formData.imagen}
          onSelectImage={handleSelectImageFromGallery}
          onClose={() => setShowImageManager(false)}
        />
      )}
    </div>
  );
}

export default DecantsManagement;

