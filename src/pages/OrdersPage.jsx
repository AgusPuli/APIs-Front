import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // 👈 Redux
import { Link } from "react-router-dom";

export default function OrdersPage() {
  // 1. Obtener sesión de Redux
  const { token, user } = useSelector((state) => state.user);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !token) {
          setLoading(false);
          return;
      }

      try {
        const res = await fetch(`${API_BASE}/orders/by-user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) throw new Error("Error al cargar órdenes");
        
        const data = await res.json();
        // Soporte para paginación o lista directa
        setOrders(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error("Error fetchOrders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (!user) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-300 text-lg">Inicia sesión para ver tus órdenes.</p>
              <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Ir al Login</Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Mis Órdenes
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
             <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No tenés órdenes todavía 🛒</p>
             <Link to="/products" className="text-blue-600 hover:underline font-medium">Ir a la tienda</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Orden #{order.id}
                  </h2>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full w-fit ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : order.status === "COMPLETED" || order.status === "PAID"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                  <p>Fecha: {new Date(order.createdAt).toLocaleString("es-AR")}</p>
                  <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          Ver detalles &rarr;
                      </Link>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        ${order.total?.toFixed(2)}
                      </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}