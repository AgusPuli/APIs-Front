import { useEffect, useState } from "react";
import { useSession } from "../components/Context/SessionContext";

export default function OrdersPage() {
  const { token, user } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/orders/by-user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar órdenes");
        const data = await res.json();
        setOrders(data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token && user) fetchOrders();
  }, [token, user]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Cargando órdenes...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Mis Órdenes
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No tenés órdenes todavía 🛒
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Orden #{order.id}
                  </h2>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                  <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>
                  <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                  <p>Descuento: ${order.discountAmount.toFixed(2)}</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
