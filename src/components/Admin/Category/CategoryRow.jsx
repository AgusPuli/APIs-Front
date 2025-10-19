// src/components/Admin/Category/CategoryRow.jsx
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function CategoryRow({ category, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <th
        scope="row"
        className="px-6 py-4 font-semibold text-gray-900 dark:text-white"
      >
        {category.name}
      </th>

      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
        {category.description || "-"}
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {category.groups && category.groups.length > 0 ? (
            category.groups.map((g) => (
              <span
                key={g.id}
                className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {g.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">Sin grupos</span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Editar categoría"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar categoría"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}