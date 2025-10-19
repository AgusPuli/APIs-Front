// src/components/Admin/Product/ProductRow.jsx
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

export default function ProductRow({ product, onEdit, onView, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <th
        scope="row"
        className="px-6 py-4 font-semibold text-gray-900 dark:text-white"
      >
        {product.name || "-"}
      </th>
      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
        {product.category || "-"}
      </td>
      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
        ${product.price !== undefined ? product.price.toFixed(2) : "-"}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onView}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <FiEye size={18} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Editar"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}