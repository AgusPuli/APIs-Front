// src/components/Admin/Product/ProductModal/ToggleActiveModal.jsx
export default function ToggleActiveModal({
  productName,
  targetActive,         // boolean: true = habilitar, false = deshabilitar
  onClose,
  onConfirm,
  loading,
}) {
  const title = targetActive ? "Habilitar producto" : "Deshabilitar producto";
  const action = targetActive ? "Habilitar" : "Deshabilitar";
  const color = targetActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          ¿Confirmás {action.toLowerCase()} <strong className="text-gray-900 dark:text-white">{productName}</strong>?
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
            className={`px-6 py-2.5 rounded-lg text-white ${color} 
                       font-semibold shadow-md transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Procesando..." : action}
          </button>
        </div>
      </div>
    </div>
  );
}
