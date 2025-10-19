import { useEffect, useMemo, useState } from "react";

// --- estilos por estado ---
const statusStyles = {
  DELIVERED: "bg-green-100 text-green-800",
  SHIPPED: "bg-sky-100 text-sky-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  DEFAULT: "bg-gray-100 text-gray-800",
};

// --- helper formato de dinero ---
const money = (n) =>
  typeof n === "number"
    ? `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
    : "-";

export default function UserOrdersSection() {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?.id) {
      setErr("No se encontró el usuario autenticado.");
      setLoading(false);
      return;
    }

    const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
    const url = `${API}/orders/by-user/${user.id}`;

    setLoading(true);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("No se pudieron cargar las órdenes.");
        return r.json();
      })
      .then((data) => {
        // El backend devuelve Page<OrderSummaryResponse>, así que viene en data.content
        if (data && data.content) setOrders(data.content);
        else if (Array.isArray(data)) setOrders(data);
        else setOrders([]);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  // --- filtrado ---
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return orders;

    return orders.filter((o) => {
      const id = String(o.id ?? "").toLowerCase();
      const status = String(o.status ?? "").toLowerCase();
      return id.includes(s) || status.includes(s);
    });
  }, [orders, q]);

  // --- loading / error ---
  if (loading)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">🧾 Mis Órdenes</h2>
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );

  if (err)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">🧾 Mis Órdenes</h2>
        <p className="text-red-600">⚠️ {err}</p>
      </div>
    );

  // --- render principal ---
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
          🧾 Mis Órdenes
        </h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por #orden o estado…"
          className="w-full sm:w-72 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          {q ? "No se encontraron resultados." : "Aún no tenés órdenes."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <tr>
                <th className="px-4 py-3 text-left"># Orden</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3">
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("es-AR")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {money(o.total ?? 0)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusStyles[o.status] ?? statusStyles.DEFAULT
                      }`}
                    >
                      {o.status ?? "UNKNOWN"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
