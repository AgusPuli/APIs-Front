import { FiEye } from "react-icons/fi";

export default function OrderRow({ order, onView }) {
  // Mapeo de estados del backend
  const statusColors = {
    PENDING: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    PROCESSING: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    COMPLETED: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    PAID: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    CANCELLED: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    CANCELED: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    SHIPPED: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  const statusLabels = {
    PENDING: "Pendiente",
    PROCESSING: "Procesando",
    COMPLETED: "Completado",
    PAID: "Pagado",
    CANCELLED: "Cancelado",
    CANCELED: "Cancelado",
    SHIPPED: "Enviado",
  };


  const customerName = order.user 
    ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() 
    : order.customer || "Cliente";
  
  const customerEmail = order.user?.email || order.email || "N/A";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
        #{order.id}
      </td>
      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
        {customerName}
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
        {customerEmail}
      </td>
      <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-semibold">
        ${order.total?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            statusColors[order.status] || statusColors.PENDING
          }`}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
        {new Date(order.createdAt).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
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