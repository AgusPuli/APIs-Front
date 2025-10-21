import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useSession } from "../components/Context/SessionContext";

export default function PaidOrder() {
  const { id } = useParams();
  const { token } = useSession();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:8080/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener la orden");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 dark:text-gray-200">
        Cargando orden...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
        >
          <FiArrowLeft /> Volver al inicio
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🧾 Pedido #{order.id ?? "—"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Estado:{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {order.status ?? "DESCONOCIDO"}
            </span>
          </p>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Productos:
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
            {order.items?.map((item) => (
              <li key={item.productId} className="py-3 flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  {item.productName ?? "Producto"} (x{item.quantity ?? 0})
                </span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  ${(item.price ?? 0).toFixed(2)}
                </span>
              </li>
            )) || <li>No hay productos</li>}
          </ul>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-gray-700 dark:text-gray-300 flex justify-between">
              <span>Subtotal:</span>
              <span>${(order.subtotal ?? 0).toFixed(2)}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex justify-between">
              <span>Descuento:</span>
              <span>-${(order.discountAmount ?? 0).toFixed(2)}</span>
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 flex justify-between mt-2">
              <span>Total pagado:</span>
              <span>${(order.total ?? 0).toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <FiShoppingBag className="text-4xl mx-auto text-green-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            ¡Gracias por tu compra!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Te enviaremos un correo con los detalles del pedido.
          </p>
        </div>
      </div>
    </div>
  );
}
