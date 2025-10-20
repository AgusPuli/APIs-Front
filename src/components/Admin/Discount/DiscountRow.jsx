const fmtDateTime = (v) => {
  if (!v) return "—";
  const d = new Date(typeof v === "string" ? v.replace(" ", "T") : v);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  }).format(d);
};

export default function DiscountRow({ item, onDelete }) {
  const code       = item.code;
  const percentage = item.percentage;
  const active     = !!item.active;
  const startsAt   = item.startsAt ?? item.startAt ?? null;
  const endsAt     = item.endsAt   ?? item.endAt   ?? null;

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700/50">
      <td className="p-3 font-medium">{code}</td>
      <td className="p-3">%</td>
      <td className="p-3">{Number(percentage)}%</td>
      <td className="p-3">—</td>
      <td className="p-3">{fmtDateTime(startsAt)}</td>
      <td className="p-3">{fmtDateTime(endsAt)}</td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded text-xs ${active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
          {active ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="p-3">
        <button onClick={onDelete} className="text-red-600 hover:underline">
          Eliminar
        </button>
      </td>
    </tr>
  );
}
