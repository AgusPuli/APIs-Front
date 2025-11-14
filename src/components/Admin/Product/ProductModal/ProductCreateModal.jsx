import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import ProductBasicInfo from "./ProductBasicInfo";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../../store/slices/productSlice";

export default function ProductCreateModal({ token, onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const modalRef = useRef(null);

  // 🔹 Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("❌ Error cargando categorías:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Crear producto (con Redux)
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProduct({ form, token, imageFile }))
      .unwrap()
      .then(() => {
        alert("✅ Producto creado correctamente");
        onClose();
      })
      .catch((err) => {
        console.error("Error al crear producto:", err);
        alert("❌ Error al crear el producto");
      });
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

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              required
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.description || cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Imagen del producto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
