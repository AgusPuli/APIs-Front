import { useState, useEffect } from "react";
import OrderTable from "./OrderTable";
import ViewOrderModal from "./ViewOrderModal";
import { useSession } from "../../Context/SessionContext";

const mockOrders = [
  {
    id: "A001",
    customer: "Juan Pérez",
    email: "juanperez@example.com",
    total: 154000,
    status: "Procesando",
    createdAt: "2025-10-01T10:24:00Z",
    items: [
      { id: "p1", name: "iPhone 15 Pro", quantity: 1, price: 120000 },
      { id: "p2", name: "Cargador MagSafe", quantity: 1, price: 34000 },
    ],
  },
  {
    id: "A002",
    customer: "María Gómez",
    email: "maria@example.com",
    total: 89000,
    status: "Completado",
    createdAt: "2025-10-05T14:12:00Z",
    items: [
      { id: "p3", name: "Auriculares Bluetooth", quantity: 2, price: 44500 },
    ],
  },
];

export default function OrderSection() {
  const { token } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/orders", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setOrders(data?.length ? data : mockOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

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
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando pedidos...</p>
        </div>
      ) : (
        <OrderTable orders={orders} onView={(order) => setSelectedOrder(order)} />
      )}

      {selectedOrder && (
        <ViewOrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
