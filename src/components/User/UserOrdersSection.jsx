import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../store/slices/orderSlice";
import UserViewOrderModal from "./UserViewOrderModal";
import { useState } from "react";

export default function OrdersSection() {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user]);

  const statusMap = {
    PAID: "Entregado",
    PENDING: "Pendiente",
    CANCELED: "Cancelado",
    PROCESSING: "Procesando",
    SHIPPED: "Enviado",
    COMPLETED: "Completado"
  };

  const statusColors = {
    PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    CANCELED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Órdenes</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Historial de compras y seguimiento de envíos
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No tienes órdenes todavía</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    Orden #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || statusColors.PENDING}`}>
                  {statusMap[order.status] || order.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.items?.length || 0} producto(s)
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${order.total?.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => setViewOrder(order)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewOrder && (
        <UserViewOrderModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}
    </div>
  );
}