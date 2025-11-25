import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../../store/slices/productSlice";
import { fetchCategories } from "../../../../store/slices/categorySlice";
import { FiX } from "react-icons/fi";
import ProductBasicInfo from "./ProductBasicInfo";
import toast from "react-hot-toast";

export default function ProductCreateModal({ onClose, onProductCreated }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);
  const { list: categories } = useSelector((state) => state.categories);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const modalRef = useRef(null);

  // Cargar categorías
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Cerrar modal clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      toast.error("Por favor selecciona una categoría");
      return;
    }

    try {
      await dispatch(createProduct({ 
        form, 
        imageFile 
      })).unwrap();

      toast.success("✅ Producto creado correctamente");
      if (onProductCreated) onProductCreated();
      onClose();
    } catch (err) {
      toast.error("❌ " + (err.message || "Error al crear producto"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Nuevo Producto
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ProductBasicInfo
            form={form}
            setForm={setForm}
            imageFile={imageFile}
            setImageFile={setImageFile}
            categories={categories}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}