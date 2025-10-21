// src/components/Admin/Discount/DiscountSection.jsx
import { useEffect, useState, useCallback } from "react";
import { DiscountAPI } from "./api";
import DiscountTable from "./DiscountTable";
import CreateDiscountModal from "./CreateDiscountModal";

export default function DiscountSection() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DiscountAPI.list();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error al cargar cupones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (payload) => {
    try {
      await DiscountAPI.create(payload);
      setShowCreate(false);
      await load();
    } catch (e) {
      alert(e.message || "No se pudo crear el cupón");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cupones</h2>
        <button
          className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          onClick={() => setShowCreate(true)}
        >
          + Crear cupón
        </button>
      </div>

      {/* Estados */}
      {loading && (
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">Cargando…</div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && <DiscountTable discounts={discounts} />}

      {/* Modal crear */}
      {showCreate && (
        <CreateDiscountModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}
