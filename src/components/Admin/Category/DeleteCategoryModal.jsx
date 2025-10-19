// src/components/Admin/Category/DeleteCategoryModal.jsx
import { FiAlertTriangle } from "react-icons/fi";

export default function DeleteCategoryModal({ categoryName, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        {/* Icon */}
        <div className="bg-red-50 dark:bg-red-900/20 p-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            Eliminar Categoría
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            ¿Estás seguro de que deseas eliminar{" "}
            <strong className="text-gray-900 dark:text-white">{categoryName}</strong>?
            <br />
            <span className="text-sm">Esta acción no se puede deshacer.</span>
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}