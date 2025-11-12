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

      
    </tr>
  );
}
