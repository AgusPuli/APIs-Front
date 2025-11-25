import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../store/slices/categorySlice";
import { FiPlus } from "react-icons/fi";
import CategoryTable from "./CategoryTable";
import CreateCategoryModal from "./CreateCategoryModal";
import toast from "react-hot-toast";

export default function CategorySection() {
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((state) => state.categories);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryCreated = (newCategory) => {
    setShowCreateModal(false);
    // Redux ya actualizó la lista automáticamente
    toast.success("✅ Categoría creada correctamente");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categorías
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona las categorías del catálogo
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus size={20} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando categorías...</p>
        </div>
      ) : (
        <CategoryTable categories={categories} />
      )}

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCategoryCreated={handleCategoryCreated}
        />
      )}
    </div>
  );
}