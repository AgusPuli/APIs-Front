import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import CategoryTable from "./CategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";
import { useSession } from "../../Context/SessionContext";

export default function CategorySection() {
  const { token } = useSession();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // 🔹 controla el modal

  // 📡 Obtener todas las categorías
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();

      setCategories(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      alert("Error al cargar las categorías ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // ✅ callback cuando se crea una nueva categoría
  const handleCategoryCreated = async () => {
    await fetchCategories();
    setShowCreateModal(false);
    alert("✅ Categoría creada correctamente");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      {/* 🧭 Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categorías
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona las categorías del catálogo
          </p>
        </div>

        {/* 🔹 Botón Crear Categoría */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" /> Nueva Categoría
        </button>
      </div>

      {/* 📋 Tabla */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando categorías...
          </p>
        </div>
      ) : (
        <CategoryTable categories={categories} />
      )}

      {/* 🪟 Modal Crear Categoría */}
      {showCreateModal && (
        <CreateCategoryModal
          token={token}
          onClose={() => setShowCreateModal(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      )}
    </div>
  );
}
