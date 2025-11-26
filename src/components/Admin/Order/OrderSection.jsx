import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../../store/slices/orderSlice";
import OrderTable from "./OrderTable";
import ViewOrderModal from "./ViewOrderModal";

export default function OrderSection() {
  const dispatch = useDispatch();
  
  // ✅ Solo necesitamos loading, orders viene de OrderTable
  const { loading } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
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

      {/* Tabla - SIN PROP orders, usa Redux internamente */}
      <OrderTable onView={(order) => setSelectedOrder(order)} />

      {selectedOrder && (
        <ViewOrderModal
          orderId={selectedOrder.id}
          onClose={() => {
            setSelectedOrder(null);
            dispatch(fetchAllOrders());
          }}
        />
      )}
    </div>
  );
}