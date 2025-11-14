// src/components/Admin/Product/ProductRow.jsx
import { FiEdit, FiSlash, FiCheckCircle } from "react-icons/fi";
import ProductStatusBadge from "./ProductStatusBadge";

export default function ProductRow({ product, onEdit, onToggle = () => {} }) {
  const isActive = !!product.active;

  // Llamada segura; si alguien no pasó onToggle, no rompe
  const handleDisable = () => onToggle?.(product, false);
  const handleEnable = () => onToggle?.(product, true);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        {product.name}
      </td>

      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
  {typeof product.category === "object"
    ? product.category?.name || "Sin categoría"
    : product.category || "Sin categoría"}
</td>

      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
        ${product.price?.toLocaleString("es-AR") ?? "0"}
      </td>

      <td className="px-6 py-4">
        <ProductStatusBadge active={isActive} />
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

          {isActive ? (
            <button
              onClick={handleDisable}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Deshabilitar producto"
            >
              <FiSlash size={18} />
            </button>
          ) : (
            <button
              onClick={handleEnable}
              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Habilitar producto"
            >
              <FiCheckCircle size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
