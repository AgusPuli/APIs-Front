import { useState, useEffect, useRef } from "react";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../../store/slices/productSlice";
import ProductBasicInfo from "./ProductBasicInfo"; // Asumo que este componente ya lo tienes
import toast from "react-hot-toast";

export default function ProductCreateModal({ onClose, onProductCreated }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);

  // Estado del formulario
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  // Estados locales
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Para mostrar qué imagen se eligió
  const modalRef = useRef(null);

  // 🔹 Obtener categorías (Idealmente esto iría en categorySlice, pero fetch local funciona bien)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        
        // Soporte para array directo o paginado
        const list = Array.isArray(data) ? data : data.content || [];
        setCategories(list);
      } catch (err) {
        console.error("❌ Error cargando categorías:", err);
        toast.error("No se pudieron cargar las categorías");
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación de tamaño (ej: 5MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La imagen es muy pesada (Máx 10MB)");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Enviar Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Por favor selecciona una categoría");
      return;
    }

    try {
      // DISPARAR ACCIÓN (Sin token, el slice lo busca solo)
      await dispatch(createProduct({ 
        form, 
        imageFile 
      })).unwrap();

      // Éxito
      if (onProductCreated) onProductCreated(); // Callback para refrescar tabla
      onClose(); // Cerrar modal

    } catch (err) {
      console.error("Error al crear producto:", err);
      toast.error(`❌ Error: ${err}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl my-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Nuevo Producto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Componente de Info Básica (Nombre, Precio, Stock, Desc) */}
          <ProductBasicInfo
            name={form.name}
            setName={(v) => setForm((f) => ({ ...f, name: v }))}
            description={form.description}
            setDescription={(v) => setForm((f) => ({ ...f, description: v }))}
            price={form.price}
            setPrice={(v) => setForm((f) => ({ ...f, price: v }))}
            stock={form.stock}
            setStock={(v) => setForm((f) => ({ ...f, stock: v }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Selección de Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Seleccionar...</option>
                {categories.map((cat) => (
                  // Ajusta cat.name o cat.id según devuelva tu backend
                  <option key={cat.id || cat} value={cat.name || cat}>
                    {cat.name || cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subida de Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imagen
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FiUpload />
                    <span className="text-sm">Subir archivo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {/* Preview miniatura */}
                {imagePreview && (
                  <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                "Crear Producto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}