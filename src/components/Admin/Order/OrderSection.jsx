import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../../store/slices/orderSlice";
import OrderTable from "./OrderTable";
import ViewOrderModal from "./ViewOrderModal";

export default function OrderSection() {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Admin carga TODAS las órdenes
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllOrders());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pedidos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los pedidos de los clientes
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay pedidos registrados
          </p>
        </div>
      ) : (
        <OrderTable 
          orders={orders} 
          onView={(order) => setSelectedOrder(order)} 
        />
      )}

      {selectedOrder && (
        <ViewOrderModal
          orderId={selectedOrder.id}
          onClose={() => {
            setSelectedOrder(null);
            // Refrescar órdenes después de cerrar el modal
            dispatch(fetchAllOrders());
          }}
        />
      )}
    </div>
  );
}