// src/components/Admin/Product/ProductStatusBadge.jsx
export default function ProductStatusBadge({ active }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  return active ? (
    <span className={`${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`}>
      Activo
    </span>
  ) : (
    <span className={`${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}>
      Deshabilitado
    </span>
  );
}
