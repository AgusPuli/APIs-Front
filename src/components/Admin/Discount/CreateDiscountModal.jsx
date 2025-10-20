// src/components/Admin/Discount/CreateDiscountModal.jsx
import { useState } from "react";
import { DiscountAPI } from "./api";

export default function CreateDiscountModal({ onClose, onSave }) {
  const [code, setCode] = useState("");
  const [value, setValue] = useState(10);     // percentage (1–100)
  const [active, setActive] = useState(true);
  const [startsAt, setStartsAt] = useState(""); // input type="datetime-local"
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Devuelve "YYYY-MM-DDTHH:mm:ss" (sin Z) o null si está vacío/invalid
  const toLocalDateTimeOrNull = (v) => {
    if (!v) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) v += "T00:00";
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
  };

  const validate = () => {
    const errs = [];
    if (!code || code.trim().length < 3) errs.push("Código: mínimo 3 caracteres");
    const pct = Number(value);
    if (!Number.isFinite(pct) || pct <= 0 || pct > 100) errs.push("Porcentaje 1–100");
    if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
      errs.push("Inicio debe ser anterior a Fin");
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errs = validate();
    if (errs.length) return setError(errs.join(" · "));

    const payload = {
      code: code.trim().toUpperCase(),
      percentage: Number(value),     // BigDecimal en el back
      active: !!active,
    };

    const s = toLocalDateTimeOrNull(startsAt);
    const f = toLocalDateTimeOrNull(endsAt);
    if (s) payload.startsAt = s;
    if (f) payload.endsAt = f;

    try {
      setSaving(true);
      await (onSave ? onSave(payload) : DiscountAPI.create(payload));
      onClose?.();
    } catch (e2) {
      setError(e2?.message || "No se pudo crear el cupón");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Nuevo cupón</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Código</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="BLACKFRIDAY"
              maxLength={32}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Porcentaje (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-500">Se aplicará como %.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Inicio</label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fin</label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="active" className="text-sm">Activo</label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-4 py-2 rounded-lg border" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60" disabled={saving}>
              {saving ? "Creando..." : "Crear cupón"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
