import { FiEye } from "react-icons/fi";

export default function OrderRow({ order, onView }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{order.id}</td>
      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.customer}</td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.email}</td>
      <td className="px-6 py-4 text-gray-900 dark:text-gray-200">${order.total.toLocaleString()}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            order.status === "Completado"
              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : order.status === "Procesando"
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
              : "bg-gray-100 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400"
          }`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={onView}
          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Ver detalles"
        >
          <FiEye size={18} />
        </button>
      </td>
    </tr>
  );
}
