import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux"; // 👈 Redux

export default function PaidOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Obtener token de Redux
  const { token } = useSelector((state) => state.user);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL fija o env
  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Falta el ID de la orden.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/orders/${id}`, {
          headers: {
            "Content-Type": "application/json",
            // Usamos token de Redux si existe
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        
        if (!res.ok) throw new Error(`No se pudo obtener la orden #${id}`);
        
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token, API_BASE]);

  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

  // Normalización de items (Mantenida igual)
  const items = order
    ? order.items ?? order.orderItems ?? order.products ?? []
    : [];

  const derivedSubtotal = items.reduce((acc, it) => {
    const unit = Number(it.unitPrice ?? it.price ?? it.unit_price ?? 0);
    const qty = Number(it.quantity ?? it.qty ?? 1);
    return acc + unit * qty;
  }, 0);

  const subtotal = Number(order?.subtotal ?? derivedSubtotal);
  const total = Number(order?.total ?? subtotal);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 dark:text-gray-200">
        <div className="flex flex-col items-center">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
           <p>Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Ocurrió un problema
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Pedido confirmado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Número de orden: <span className="font-medium">{order?.orderNumber ?? order?.id ?? id}</span>
            </p>
            {order?.createdAt || order?.date ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Fecha: {new Date(order.createdAt ?? order.date).toLocaleString("es-AR")}
              </p>
            ) : null}
          </div>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Seguir comprando
          </button>
        </div>

        {/* Lista de Productos */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
          Productos
        </h2>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
          {items.length > 0 ? (
            items.map((item, idx) => {
              const unit = Number(item.unitPrice ?? item.price ?? item.unit_price ?? 0);
              const qty = Number(item.quantity ?? item.qty ?? 1);
              const lineTotal = unit * qty;
              const key = item.productId ?? item.id ?? `${item.name}-${idx}`;

              return (
                <li key={key} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{item.productName ?? item.name ?? "Producto"}</span>{" "}
                    <span className="text-sm text-gray-500 dark:text-gray-400">(x{qty})</span>
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {fmtMoney(lineTotal)}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="py-3 text-gray-600 dark:text-gray-400">No hay productos en esta orden.</li>
          )}
        </ul>

        {/* Totales */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <p className="text-gray-700 dark:text-gray-300 flex justify-between">
            <span>Subtotal:</span>
            <span>{fmtMoney(subtotal)}</span>
          </p>
          {/* Si el backend devuelve descuento */}
          {order.discountAmount > 0 && (
             <p className="text-green-600 dark:text-green-400 flex justify-between">
                <span>Descuento:</span>
                <span>-{fmtMoney(order.discountAmount)}</span>
             </p>
          )}
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 flex justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>Total pagado:</span>
            <span>{fmtMoney(total)}</span>
          </p>
        </div>

        {/* Detalles de Pago y Envío */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Pago</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Método: <span className="font-medium">{order?.paymentMethod ?? "Tarjeta"}</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Estado: <span className="font-medium text-green-600 dark:text-green-400">{order?.paymentStatus ?? "Aprobado"}</span>
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Envío</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Estado: <span className="font-medium">{order?.status ?? "Procesando"}</span>
            </p>
            {order?.shippingAddress && (
               <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                 Dirección: {typeof order.shippingAddress === 'string' ? order.shippingAddress : order.shippingAddress.address || 'Domicilio'}
               </p>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <FiShoppingBag className="text-4xl mx-auto text-green-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">¡Gracias por tu compra!</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Te enviaremos un correo con los detalles.</p>
          
          <div className="mt-6 flex justify-center gap-4">
             <button onClick={() => navigate("/user")} className="text-blue-600 hover:underline font-medium">Ver mis pedidos</button>
          </div>
        </div>

      </div>
    </div>
  );
}