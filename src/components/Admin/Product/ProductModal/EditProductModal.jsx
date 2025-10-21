import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import ProductBasicInfo from "./ProductBasicInfo";

export default function EditProductModal({ token, product, onClose, onProductUpdated }) {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    category: product.category || "",
  });

  const [imageFile, setImageFile] = useState(null); // ✅ nueva imagen seleccionada
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const modalRef = useRef(null);

  // 📡 Obtener categorías desde el backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:8080/categories", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [token]);

  // 🧩 Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 🧩 Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // ✅ Guardar cambios (PUT + POST imagen)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Actualizar datos básicos
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
      };

      const res = await fetch(`http://localhost:8080/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error al actualizar producto`);
      const updated = await res.json();

      // 2️⃣ Subir imagen si el usuario seleccionó una nueva
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const imgRes = await fetch(
          `http://localhost:8080/products/${product.id}/image`,
          {
            method: "POST",
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: formData,
          }
        );

        if (!imgRes.ok)
          throw new Error(`Error al subir imagen: ${imgRes.status}`);
      }

      alert("✅ Producto actualizado correctamente");
      onProductUpdated(updated);
      onClose();
    } catch (err) {
      console.error("❌ Error al actualizar producto:", err);
      alert("❌ No se pudo actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar Producto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
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
            {loadingCategories ? (
              <p className="text-gray-500 text-sm">Cargando categorías...</p>
            ) : (
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                required
              >
                <option value="">Seleccionar Categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Imagen nueva */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva Imagen (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2"
            />
            {product.imageUrl && (
              <p className="text-sm text-gray-500 mt-2">
                Imagen actual: <em>{product.imageUrl}</em>
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
