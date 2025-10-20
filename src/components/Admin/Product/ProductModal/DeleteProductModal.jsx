// ✅ src/components/Admin/Product/ProductModal/DeleteProductModal.jsx
export default function DeleteProductModal({ productName, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Eliminar Producto
        </h2>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          ¿Estás seguro de que deseas eliminar{" "}
          <strong className="text-gray-900 dark:text-white">{productName}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 
                       dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                       font-semibold transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 
                       font-semibold shadow-md transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
