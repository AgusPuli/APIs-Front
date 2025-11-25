import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById, updateOrderStatus } from "../../../store/slices/orderSlice";
import {
  FiX,
  FiPackage,
  FiUser,
  FiMail,
  FiCalendar,
  FiTag,
  FiSave,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function ViewOrderModal({ orderId, onClose }) {
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order) {
      setStatus(order.status || "PENDING");
    }
  }, [order]);

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };

  const handleSaveStatus = async () => {
    setIsSaving(true);

    try {
      await dispatch(updateOrderStatus({ 
        orderId: order.id, 
        status 
      })).unwrap();
      
      toast.success("✅ Estado actualizado correctamente");
    } catch (error) {
      toast.error("❌ " + (error.message || "Error al actualizar el estado"));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Pedido #{order.id}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Creado el {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info general */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <FiUser /> Cliente
              </div>
              <p className="text-gray-900 dark:text-white">
                {order.user?.firstName} {order.user?.lastName}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <FiMail /> Email
              </div>
              <p className="text-gray-900 dark:text-white break-all">
                {order.user?.email}
              </p>
            </div>

            {/* Estado editable */}
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <FiTag /> Estado
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-sm font-semibold border-none focus:ring-2 focus:ring-blue-500 transition ${statusColors[status]}`}
              >
                <option value="PENDING">Pendiente</option>
                <option value="PROCESSING">Procesando</option>
                <option value="COMPLETED">Completado</option>
                <option value="PAID">Pagado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <FiCalendar /> Fecha
              </div>
              <p className="text-gray-900 dark:text-white">
                {new Date(order.createdAt).toLocaleString("es-AR")}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-medium">
              <FiPackage /> Productos ({order.items?.length || 0})
            </div>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.product?.name || item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Total
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${order.total?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
          >
            Cerrar
          </button>
          <button
            onClick={handleSaveStatus}
            disabled={isSaving || status === order.status}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave />
            {isSaving ? "Guardando..." : "Guardar Estado"}
          </button>
        </div>
      </div>
    </div>
  );
}