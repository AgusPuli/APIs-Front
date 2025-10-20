import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        {product.name}
      </td>

      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
        {product.category || "Sin categoría"}
      </td>

      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
        ${product.price?.toLocaleString("es-AR") ?? "0"}
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Editar producto"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar producto"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
