// src/components/Admin/Discount/DeleteDiscountModal.jsx
export default function DeleteDiscountModal({ item, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-2">Eliminar cupón</h3>
        <p className="text-sm text-gray-500">
          ¿Seguro querés eliminar el cupón <b>{item.code}</b>? Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-lg border" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
