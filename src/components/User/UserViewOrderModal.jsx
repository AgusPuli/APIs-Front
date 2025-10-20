// src/components/User/ViewOrderModal.jsx
import { useState } from "react";
import { FiX, FiPackage } from "react-icons/fi";

const statusColors = {
  Pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Procesando: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Enviado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Cancelado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Entregado: "bg-green-200 text-green-900 dark:bg-green-800/50 dark:text-green-300",
};

export default function ViewOrderModal({ order, onClose, onStatusChange, loadingStatus }) {
  const [status, setStatus] = useState(order.status);
  const canCancel = ["Pendiente", "Procesando"].includes(status);

  const handleCancel = () => {
    if (!canCancel) return;
    onStatusChange(order.id, "Cancelado");
    setStatus("Cancelado");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pedido #{order.id}
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info del pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Cliente:</span> {order.customer}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Email:</span> {order.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Teléfono:</span> {order.phone || "-"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Total:</span>{" "}
                <span className="font-bold text-green-600 dark:text-green-400">
                  ${order.total.toLocaleString()}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}>
                  {status}
                </span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
              <FiPackage /> Productos
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Cantidad: {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ${item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors"
              disabled={loadingStatus}
            >
              Cerrar
            </button>
            {canCancel && (
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingStatus}
              >
                {loadingStatus ? "Cancelando..." : "Cancelar Pedido"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
