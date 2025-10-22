// src/components/User/UserViewOrderModal.jsx
import { FiX, FiPackage } from "react-icons/fi";

const statusColors = {
  Pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Procesando: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Enviado: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Cancelado: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Entregado: "bg-green-200 text-green-900 dark:bg-green-800/50 dark:text-green-300",
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(n)) ? Number(n) : 0);

export default function UserViewOrderModal({ order, onClose }) {
  if (!order) return null;

  // Normalizaciones defensivas
  const id = order.id ?? order.orderId ?? order.order?.id ?? "N/A";
  const status = order.status ?? "Pendiente";
  const method = order.method ?? order.paymentMethod ?? order.payment?.method ?? "N/D";
  const createdAt =
    order.createdAt ?? order.date ?? order.order?.createdAt ?? new Date().toISOString();
  const customer = order.customer ?? order.userName ?? "Usuario";
  const email = order.email ?? order.userEmail ?? "-";
  const phone = order.phone ?? order.userPhone ?? "-";

  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.orderItems)
    ? order.orderItems
    : Array.isArray(order.order?.items)
    ? order.order.items
    : [];

  // Si no hay items, mostramos un fallback para que el modal no quede vacío
  const safeItems =
    items.length > 0
      ? items
      : [
          {
            id: "1",
            name: `Pedido #${id}`,
            quantity: 1,
            price: order.total ?? 0,
          },
        ];

  const derivedSubtotal = safeItems.reduce((acc, it) => {
    const unit =
      Number(it.unitPrice ?? it.price ?? it.unit_price ?? 0);
    const qty = Number(it.quantity ?? it.qty ?? 1);
    return acc + unit * qty;
  }, 0);

  const subtotal = Number(order.subtotal ?? derivedSubtotal);
  const total = Number(order.total ?? subtotal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
              <FiPackage size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Pedido #{id}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(createdAt).toLocaleString("es-AR")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Cerrar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info del pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Cliente:</span> {customer}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Email:</span> {email}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Teléfono:</span> {phone}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Método de pago:</span> {method}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Estado:</span>{" "}
                <span
                  className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                >
                  {status}
                </span>
              </p>
            </div>
          </div>

          {/* Lista de productos */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Productos</h4>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {safeItems.map((it, idx) => {
                const name = it.productName ?? it.name ?? `Item ${idx + 1}`;
                const qty = Number(it.quantity ?? it.qty ?? 1);
                const unit = Number(it.unitPrice ?? it.price ?? it.unit_price ?? 0);
                const line = unit * qty;
                const key = it.productId ?? it.id ?? `${name}-${idx}`;
                return (
                  <li
                    key={key}
                    className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                  >
                    <div className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{name}</span>{" "}
                      <span className="text-sm text-gray-500 dark:text-gray-400">(x{qty})</span>
                      {unit > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Unitario: {fmtMoney(unit)}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {fmtMoney(line)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Totales */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-gray-700 dark:text-gray-300 flex justify-between">
              <span>Subtotal:</span>
              <span>{fmtMoney(subtotal)}</span>
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 flex justify-between mt-2">
              <span>Total:</span>
              <span>{fmtMoney(total)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
