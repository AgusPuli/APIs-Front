// src/components/User/OrdersSection.jsx
import { useEffect, useState } from "react";
import { useSession } from "../Context/SessionContext";
import ViewOrderModal from "./UserViewOrderModal";

const mockOrders = [
  {
    id: "1234",
    total: 4500,
    status: "Pendiente",
    createdAt: new Date(),
    customer: "Lucas",
    email: "lucas@example.com",
    phone: "123456789",
    items: [
      { id: "1", name: "IPhone 17 Pro", quantity: 1, price: 4500 },
    ],
  },
];

export default function OrdersSection() {
  const { token } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/orders/mine", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("No se encontraron pedidos");

      const data = await res.json();
      setOrders(data.length ? data : mockOrders);
    } catch (err) {
      console.error(err);
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingStatus(true);
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      alert(`Pedido ${newStatus.toLowerCase()} correctamente`);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el pedido");
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Mis Pedidos
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No tienes pedidos aún.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg cursor-pointer hover:shadow-md transition"
              onClick={() => setViewOrder(o)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white">Pedido #{o.id}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{o.status}</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">${o.total}</span>
            </div>
          ))}
        </div>
      )}

      {viewOrder && (
        <ViewOrderModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onStatusChange={handleStatusChange}
          loadingStatus={loadingStatus}
        />
      )}
    </div>
  );
}
