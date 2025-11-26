// src/components/Admin/Product/ProductTable.jsx
import { useSelector } from "react-redux";
import ProductRow from "./ProductRow";

export default function ProductTable({ onEdit, onToggle }) {

  const { list: products, loading } = useSelector((state) => state.products);

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow text-center">
        <div className="animate-pulse">Cargando productos...</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow text-gray-500 dark:text-gray-400 text-center">
        No hay productos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900/40">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onEdit={() => onEdit?.(p)}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}