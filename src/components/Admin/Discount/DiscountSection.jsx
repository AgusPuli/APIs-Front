import { useEffect, useState, useCallback } from "react";
import { DiscountAPI } from "./api";
import DiscountTable from "./DiscountTable";
import CreateDiscountModal from "./CreateDiscountModal";
import DeleteDiscountModal from "./DeleteDiscountModal";

export default function DiscountSection() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DiscountAPI.list();

      // normalizo cualquier forma
      let items = [];
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data?.content)) items = data.content;
      else if (Array.isArray(data?.data)) items = data.data;
      else if (data && typeof data === "object") {
        const firstArray = Object.values(data).find(Array.isArray);
        items = firstArray || [];
      }

      setDiscounts(items);
    } catch (e) {
      setError(e?.message || "No se pudieron cargar los cupones");
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (payload) => {
    try {
      await DiscountAPI.create(payload);
      setShowCreate(false);
      await load();
    } catch (err) {
      setError(err.message || "No se pudo crear el cupón");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await DiscountAPI.remove(toDelete.id);
      setToDelete(null);
      await load();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el cupón");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cupones</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestioná los códigos de descuento.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          + Nuevo cupón
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center shadow">
          <p className="text-gray-700 dark:text-gray-300">Cargando cupones…</p>
        </div>
      ) : discounts.length === 0 ? (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-10 text-center shadow">
          <p className="text-gray-700 dark:text-gray-300 mb-3">Aún no hay cupones.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Crear el primero
          </button>
        </div>
      ) : (
        <DiscountTable
          discounts={discounts}
          onDelete={(disc) => setToDelete(disc)}
          onEdit={() => {}}
          onToggleActive={() => {}}
        />
      )}

      {showCreate && (
        <CreateDiscountModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}
      {toDelete && (
        <DeleteDiscountModal
          discount={toDelete}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
