// src/components/Admin/Discount/DiscountTable.jsx
import DiscountRow from "./DiscountRow";

export default function DiscountTable({ discounts = [] }) {
  if (!discounts.length) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow text-gray-500 text-center">
        No hay cupones registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
      <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Código</th>
            <th className="px-6 py-3">Descuento (%)</th>
            <th className="px-6 py-3">Activo</th>
            <th className="px-6 py-3">Inicio</th>
            <th className="px-6 py-3">Fin</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <DiscountRow key={d.id || d.code} discount={d} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
