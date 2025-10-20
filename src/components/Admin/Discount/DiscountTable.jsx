import DiscountRow from "./DiscountRow";

export default function DiscountTable({ discounts = [], onDelete }) {
  const rows = Array.isArray(discounts) ? discounts : [];

  return (
    <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700/50 text-left">
          <tr>
            <th className="p-3">Código</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Valor</th>
            <th className="p-3">Mínimo</th>
            <th className="p-3">Inicio</th>
            <th className="p-3">Fin</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <DiscountRow
              key={d.id ?? d.code}
              item={d}
              onDelete={() => onDelete?.(d)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
