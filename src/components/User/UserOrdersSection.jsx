// src/components/User/UserOrdersSection.jsx
import { useEffect, useState } from "react";
import { useSession } from "../Context/SessionContext";
import ViewOrderModal from "./UserViewOrderModal";

export default function OrdersSection() {
  const { token, user } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

  // Mapeo de estados backend (OrderStatus) a estados UI
  const statusMap = {
    PAID: "Entregado",
    PENDING: "Pendiente",
    CANCELED: "Cancelado",
    PROCESSING: "Procesando",
    SHIPPED: "Enviado",
  };

  const fmtMoney = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

  // Convierte números en string tipo "$ 1.234,56" o "1,234.56" a Number
  const parseMoney = (v) => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    let s = String(v).trim();
    // Quitamos símbolos y espacios no numéricos
    s = s.replace(/[^\d.,-]/g, "");
    // Caso: tiene punto y coma -> usualmente miles con punto, decimales con coma
    if (s.includes(".") && s.includes(",")) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else if (s.includes(",") && !s.includes(".")) {
      // Solo coma: tratamos coma como decimal
      s = s.replace(",", ".");
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const numberish = (v) => parseMoney(v);

  const sumItems = (maybeItems) => {
    const items = Array.isArray(maybeItems) ? maybeItems : [];
    return items.reduce((acc, it) => {
      const unit =
        numberish(it?.unitPrice) ??
        numberish(it?.price) ??
        numberish(it?.unit_price) ??
        0;
      const qty = numberish(it?.quantity) ?? numberish(it?.qty) ?? 1;
      return acc + unit * qty;
    }, 0);
  };

  const normalizeFromPayment = (p) => {
    // id de orden
    const id =
      p?.orderId ??
      p?.order?.id ??
      p?.id ??
      p?.paymentId ??
      p?.transactionId ??
      "N/A";

    // método de pago
    const method = p?.method ?? p?.paymentMethod ?? p?.payment?.method ?? "N/D";

    // estado
    const rawStatus =
      p?.orderStatus ?? p?.status ?? p?.paymentStatus ?? "PENDING";
    const status = statusMap[rawStatus] ?? "Pendiente";

    // fecha
    const createdAt =
      p?.createdAt ?? p?.paymentDate ?? p?.date ?? new Date().toISOString();

    // items si llegan anidados en el pago
    const items =
      p?.items ?? p?.orderItems ?? p?.order?.items ?? [];

    // candidato a total directo
    const amountCandidate =
      numberish(p?.amount) ??
      numberish(p?.total) ??
      numberish(p?.orderTotal) ??
      numberish(p?.finalAmount) ??
      numberish(p?.paid) ??
      numberish(p?.value) ??
      numberish(p?.price) ??
      numberish(p?.payment?.amount);

    // derivado por items (si existen)
    const derivedFromItems = sumItems(items);

    const total = amountCandidate ?? derivedFromItems ?? 0;

    return {
      id: String(id),
      total,
      status,
      rawStatus,
      method,
      createdAt,
      items,
      _sourcePayment: p,
    };
  };

  const fetchOrders = async () => {
    if (!token) return;

    setLoading(true);
    try {
      // 1) Traemos pagos del usuario
      const res = await fetch(`${API_BASE}/payments/my-payments`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudieron cargar los pagos");
      const payments = await res.json();

      // 2) Normalizamos cada pago
      let normalized = (payments ?? []).map(normalizeFromPayment);

      // 3) Para los que sigan con total 0, buscamos la orden real
      const needOrderFetch = normalized.filter(
        (o) => (!o.total || o.total === 0) && o.id !== "N/A"
      );

      if (needOrderFetch.length > 0) {
        const details = await Promise.all(
          needOrderFetch.map(async (o) => {
            try {
              const r = await fetch(`${API_BASE}/orders/${o.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });
              if (!r.ok) throw new Error("No ok");
              const order = await r.json();

              const orderSubtotal =
                numberish(order?.subtotal) ??
                sumItems(order?.items ?? order?.orderItems);

              const orderDiscount =
                numberish(order?.discountAmount) ??
                numberish(order?.discount) ??
                0;

              const orderTotal =
                numberish(order?.total) ??
                (orderSubtotal !== undefined
                  ? orderSubtotal - (orderDiscount ?? 0)
                  : undefined);

              return {
                id: o.id,
                total: orderTotal ?? o.total ?? 0,
                items: order?.items ?? order?.orderItems ?? o.items ?? [],
                method:
                  o.method ??
                  order?.paymentMethod ??
                  order?.payment?.method ??
                  "N/D",
                rawStatus: o.rawStatus ?? order?.status,
                createdAt: o.createdAt ?? order?.createdAt ?? order?.date,
              };
            } catch {
              return {
                id: o.id,
                total: o.total ?? 0,
                items: o.items ?? [],
              };
            }
          })
        );

        // 4) Mergeamos detalles con la lista original
        normalized = normalized.map((o) => {
          const d = details.find((x) => x.id === o.id);
          if (!d) return o;
          return {
            ...o,
            total: d.total ?? o.total,
            items: d.items?.length ? d.items : o.items,
            method: d.method ?? o.method,
            rawStatus: d.rawStatus ?? o.rawStatus,
            createdAt: d.createdAt ?? o.createdAt,
          };
        });
      }

      // 5) Ordenamos por fecha desc
      normalized.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // 6) Armamos objeto final para la UI
      const uiOrders = normalized.map((o) => ({
        id: o.id,
        total: o.total ?? 0,
        status: statusMap[o.rawStatus] ?? "Pendiente",
        method: o.method ?? "N/D",
        createdAt: o.createdAt,
        customer: user ? `${user.firstName} ${user.lastName}` : "Usuario",
        email: user?.email ?? "",
        phone: user?.phone ?? "-",
        items: o.items,
      }));

      setOrders(uiOrders);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Debes iniciar sesión para ver tus pedidos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Mis Pedidos
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 dark:text-gray-400">
              Cargando pedidos...
            </p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">
            📦
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            No tienes pedidos aún
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Tus pedidos aparecerán aquí cuando realices una compra.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
              onClick={() => setViewOrder(o)}
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Pedido #{o.id}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {o.status}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">
                    •
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {o.method}
                  </span>
                </div>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {fmtMoney(o.total)}
              </span>
            </div>
          ))}
        </div>
      )}

      {viewOrder && (
        <ViewOrderModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}
    </div>
  );
}
