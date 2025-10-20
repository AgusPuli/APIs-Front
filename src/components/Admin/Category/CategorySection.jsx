// ✅ src/components/Admin/Category/CategorySection.jsx
import { useState, useEffect } from "react";
import CategoryTable from "./CategoryTable";
import { useSession } from "../../Context/SessionContext";

export default function CategorySection() {
  const { token } = useSession();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📡 Obtener todas las categorías (solo lectura)
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();

      // ✅ Las categorías vienen del enum (no se pueden crear)
      setCategories(data || []);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      {/* 🧭 Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categorías
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Lista de categorías fijas del sistema
          </p>
        </div>
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
    </div>
  );
}
