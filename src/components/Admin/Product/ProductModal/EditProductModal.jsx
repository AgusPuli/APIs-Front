// src/components/Admin/Product/ProductModal/EditProductModal.jsx
import { useState, useEffect, useRef } from "react";
import ProductBasicInfo from "./ProductBasicInfo";
import CategorySelect from "./ProductCategorySelect";
import ProductImages from "./ProductImages";
import ProductSpecifications from "./ProductSpecifications";
import { FiPlus, FiX } from "react-icons/fi";

export default function EditProductModal({ token, product, onClose, onProductUpdated }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState(product.name || "");
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState(product.subcategories || []);
  const [price, setPrice] = useState(product.price?.toString() || "");
  const [images, setImages] = useState(product.images?.length ? product.images : [""]);
  const [featured, setFeatured] = useState(product.featured || false);
  const [description, setDescription] = useState(product.description || "");
  const [specifications, setSpecifications] = useState(product.specifications || {});
  const [colors, setColors] = useState(product.colors?.length ? product.colors : ["#000000"]);
  const [storageOptions, setStorageOptions] = useState(
    product.storageOptions?.length ? product.storageOptions : [""]
  );
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories");
        const data = await res.json();
        const cats = data.map((cat) => ({
          ...cat,
          groups: cat.groups || [],
        }));
        setCategories(cats);

        // Preseleccionar categoría si coincide por nombre
        if (product.category) {
          const found = cats.find((c) => c.name === product.category);
          if (found) setCategory(found);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [product.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return alert("Selecciona una categoría");

    setLoading(true);
    try {
      const body = {
        id: product.id,
        name,
        price: Number(price),
        categoryId: category.id,
        subcategories,
        images: images.filter((i) => i),
        featured,
        description,
        specifications,
        colors: colors.filter((c) => c),
        storageOptions: storageOptions.filter((s) => s),
      };

      const res = await fetch(`http://localhost:8080/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      onProductUpdated(data);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl shadow-2xl my-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <ProductBasicInfo name={name} setName={setName} price={price} setPrice={setPrice} />

          <CategorySelect
            categories={categories}
            category={category}
            setCategory={setCategory}
            subcategories={subcategories}
            setSubcategories={setSubcategories}
          />

          <ProductImages images={images} setImages={setImages} />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={3}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured-edit"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="featured-edit" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Producto destacado
            </label>
          </div>

          <ProductSpecifications
            specifications={specifications}
            setSpecifications={setSpecifications}
          />

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Colores
            </label>
            <div className="space-y-2">
              {colors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color || "#000000"}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[idx] = e.target.value;
                      setColors(newColors);
                    }}
                    className="w-12 h-12 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {color || "#000000"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setColors([...colors, "#000000"])}
              className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <FiPlus size={18} /> Agregar Color
            </button>
          </div>

          {/* Storage Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Opciones de Almacenamiento
            </label>
            <div className="space-y-2">
              {storageOptions.map((s, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={s}
                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    onChange={(e) => {
                      const newS = [...storageOptions];
                      newS[idx] = e.target.value;
                      setStorageOptions(newS);
                    }}
                    placeholder="ej. 256GB"
                  />
                  <button
                    type="button"
                    onClick={() => setStorageOptions(storageOptions.filter((_, i) => i !== idx))}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStorageOptions([...storageOptions, ""])}
              className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <FiPlus size={18} /> Agregar Opción
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}