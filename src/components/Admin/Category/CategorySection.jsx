import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../store/slices/categorySlice";
import { FiPlus } from "react-icons/fi";
import CategoryTable from "./CategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";
import toast from "react-hot-toast";

export default function CategorySection() {
  const dispatch = useDispatch();
  

  const { loading, error } = useSelector((state) => state.categories);
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Callback cuando se crea una nueva categoría
  const handleCategoryCreated = () => {
    dispatch(fetchCategories());
    setShowCreateModal(false);
    toast.success("Categoría creada correctamente");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categorías
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona las categorías del catálogo
          </p>
        </div>

        {/* Botón Crear Categoría */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" />
          Agregar Categoría
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          <p>Error: {error}</p>
          <button onClick={() => dispatch(fetchCategories())} className="mt-2 text-blue-600 dark:text-blue-400 underline">
            Reintentar
          </button>
        </div>
      )}


      <CategoryTable />

      {/* Modal Crear */}
      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      )}
    </div>
  );
}