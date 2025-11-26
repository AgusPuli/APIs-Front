// src/components/Admin/Category/CategoryTable.jsx
import { useSelector } from "react-redux";
import CategoryRow from "./CategoryRow";

export default function CategoryTable({ onEdit, onDelete }) {
  // ✅ Obtener categorías directamente de Redux
  const { list: categories, loading } = useSelector((state) => state.categories);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Nombre de Categoría</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories && categories.length > 0 ? (
              categories.map((c) => (
                <CategoryRow
                  key={c.id}
                  category={c}
                  onEdit={() => onEdit?.(c)}
                  onDelete={() => onDelete?.(c)}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No hay categorías disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}