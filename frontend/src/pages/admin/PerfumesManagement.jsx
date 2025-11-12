import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { perfumesApi, brandsApi } from "../../services/api";
import ImageManager from "../../components/ImageManager";
import "./Management.css";
// Base del backend (si usas http://host:4000/api, quitamos el /api)
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/,"");
// Normaliza y resuelve la URL para el <img> de PREVIEW
const resolveImageUrl = (u) => {
  if (!u) return "";
  // Arregla datos viejos tipo "/img/http://..."
  u = u.replace(/^\/img\/(https?:\/\/)/i, "$1");
  // Si es absoluta (Opción B del backend), úsala tal cual
  if (/^https?:\/\//i.test(u)) return u;
  // Si es relativa del backend (/uploads/...), préfixa host del backend
  if (u.startsWith("/uploads/")) return `${API_BASE}${u}`;
  // Cualquier otro caso (compatibilidad /img/... del frontend)
  return u;
};


function PerfumesManagement() {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    imagenUrl: "",
    categoria: "hombre",
    marcaId: "",
  });
  const normalizeImage = (u) =>
    u ? u.replace(/^\/img\/(https?:\/\/)/i, "$1") : "";

  useEffect(() => {
    // Debouncing: esperar 500ms después de que el usuario deje de escribir
    const delaySearch = setTimeout(() => {
      loadData();
    }, 500);

    // Limpiar el timeout si el usuario sigue escribiendo
    return () => clearTimeout(delaySearch);
  }, [searchTerm, showInactive]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = { limit: 1000 };
      if (searchTerm) params.search = searchTerm;
      if (showInactive) params.includeInactive = "true";

      const [perfumesRes, brandsRes] = await Promise.all([
        perfumesApi.getAll(params),
        brandsApi.getAll(),
      ]);
      setPerfumes(perfumesRes.data.perfumes);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      imagenUrl: normalizeImage(formData.imagenUrl),
    };

    try {
      if (editingPerfume) {
        await perfumesApi.update(editingPerfume.id, payload);
        alert("Perfume actualizado correctamente");
      } else {
        await perfumesApi.create(payload);
        alert("Perfume creado correctamente");
      }
      setShowForm(false);
      setEditingPerfume(null);
      setImageError(false);
      setFormData({
        nombre: "",
        precio: "",
        imagenUrl: "",
        categoria: "hombre",
        marcaId: "",
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || "Error al guardar perfume");
    }
  };

  const handleEdit = (perfume) => {
    setEditingPerfume(perfume);
    setFormData({
      nombre: perfume.nombre,
      precio: perfume.precio,
      imagenUrl: normalizeImage(perfume.imagenUrl), // 👈
      categoria: perfume.categoria,
      marcaId: perfume.marca?.brandId || perfume.marcaBrandId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este perfume?")) return;

    try {
      await perfumesApi.delete(id);
      alert("Perfume eliminado correctamente");
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || "Error al eliminar perfume");
    }
  };

  const handleActivate = async (id) => {
    try {
      await perfumesApi.activate(id);
      alert("Perfume activado correctamente");
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || "Error al activar perfume");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPerfume(null);
    setImageError(false);
    setFormData({
      nombre: "",
      precio: "",
      imagenUrl: "",
      categoria: "hombre",
      marcaId: "",
    });
  };

  const handleImageUrlChange = (e) => {
    const url = normalizeImage(e.target.value);
    setFormData((prev) => ({ ...prev, imagenUrl: url }));
    setImageError(false); // si tienes este flag
  };

  const handleSelectImageFromGallery = (imageUrl) => {
    const url = normalizeImage(imageUrl);
    setFormData((prev) => ({ ...prev, imagenUrl: url }));
    setImageError(false);
    setShowImageManager(false);
  };

  if (loading) {
    return <div className="management-loading">Cargando perfumes...</div>;
  }

  return (
    <div className="management-container">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="back-to-dashboard"
      >
        ← Volver al Dashboard
      </button>

      <div className="management-header">
        <h2>Gestión de Perfumes</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar perfumes..."
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
            + Nuevo Perfume
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <h3>{editingPerfume ? "Editar Perfume" : "Nuevo Perfume"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={formData.imagenUrl || ""}
                    onChange={handleImageUrlChange}
                    placeholder="/img/marca/perfume.jpg"
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
                <small
                  style={{
                    color: "#666",
                    fontSize: 12,
                    marginTop: 5,
                    display: "block",
                  }}
                >
                  La imagen se sirve desde el backend en <code>/uploads</code>.
                  También puedes pegar una URL absoluta.
                </small>
                {formData.imagenUrl && (
                  <div className="image-preview">
                    <label>Preview:</label>
                    <img
                      src={resolveImageUrl(formData.imagenUrl)}
                      alt="Preview"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "10px",
                        border: imageError
                          ? "2px solid #dc3545"
                          : "2px solid #28a745",
                        borderRadius: "8px",
                        padding: "5px",
                        display: "block",
                      }}
                    />
                    {imageError && (
                      <span
                        style={{
                          color: "#dc3545",
                          fontSize: "12px",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        ⚠️ La imagen no se puede cargar. Verifica la ruta.
                      </span>
                    )}
                    {!imageError && formData.imagenUrl && (
                      <span
                        style={{
                          color: "#28a745",
                          fontSize: "12px",
                          marginTop: "5px",
                          display: "block",
                        }}
                      >
                        ✓ Imagen cargada correctamente
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  required
                >
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div className="form-group">
                <label>Marca (ID o slug)</label>
                <select
                  value={formData.marcaId}
                  onChange={(e) =>
                    setFormData({ ...formData, marcaId: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar marca...</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.brandId}>
                      {brand.nombre} ({brand.brandId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingPerfume ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                >
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
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {perfumes.map((perfume) => (
              <tr
                key={perfume.id}
                className={!perfume.activo ? "inactive-row" : ""}
              >
                <td>{perfume.nombre}</td>
                <td>{perfume.marca?.nombre || "N/A"}</td>
                <td>{perfume.categoria}</td>
                <td>₡{parseFloat(perfume.precio).toLocaleString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      perfume.activo ? "active" : "inactive"
                    }`}
                  >
                    {perfume.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(perfume)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  {perfume.activo ? (
                    <button
                      onClick={() => handleDelete(perfume.id)}
                      className="delete-button"
                    >
                      Eliminar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(perfume.id)}
                      className="activate-button"
                    >
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
          currentImageUrl={formData.imagenUrl}
          onSelectImage={handleSelectImageFromGallery}
          onClose={() => setShowImageManager(false)}
        />
      )}
    </div>
  );
}

export default PerfumesManagement;
