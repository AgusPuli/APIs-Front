// src/components/Admin/Discount/CreateDiscountModal.jsx
import { useState } from "react";

export default function CreateDiscountModal({ onClose, onSave }) {
    const [code, setCode] = useState("");
    const [value, setValue] = useState(10);
    const [active, setActive] = useState(true);
    const [startsAt, setStartsAt] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

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
        if (!code || code.trim().length < 3) {
            errs.push("Código: mínimo 3 caracteres");
        }
        const pct = Number(value);
        if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
            errs.push("Porcentaje 1-100");
        }
        if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
            errs.push("Inicio debe ser anterior a Fin");
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Debug logs
        console.log("🔍 Form values:", { 
            code, 
            codeLength: code.length,
            value, 
            active, 
            startsAt, 
            endsAt 
        });
        
        // Validar
        const errs = validate();
        if (errs.length) {
            console.error("❌ Validation errors:", errs);
            return setError(errs.join(" · "));
        }

        // Construir payload
        const payload = {
            code: code.trim().toUpperCase(),
            percentage: Number(value),
            active: !!active,
        };

        const s = toLocalDateTimeOrNull(startsAt);
        const f = toLocalDateTimeOrNull(endsAt);
        if (s) payload.startsAt = s;
        if (f) payload.endsAt = f;

        console.log("📦 Discount payload to send:", payload);
        console.log("   - code:", payload.code);
        console.log("   - code length:", payload.code?.length);
        console.log("   - percentage:", payload.percentage);

        try {
            setSaving(true);
            await onSave(payload);
            console.log("✅ Discount created successfully");
            onClose?.();
        } catch (e2) {
            console.error("❌ Error creating discount:", e2);
            setError(e2?.message || "No se pudo crear el cupón");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Nuevo cupón
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    {/* Código */}
                    <div>
                        <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                            Código *
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="BLACKFRIDAY"
                            maxLength={32}
                            autoFocus
                            required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Mínimo 3 caracteres, se convertirá a mayúsculas
                        </p>
                    </div>

                    {/* Porcentaje */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                                Porcentaje (%) *
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="flex items-end">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Se aplicará como descuento %
                            </div>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                                Fecha inicio (opcional)
                            </label>
                            <input
                                type="datetime-local"
                                value={startsAt}
                                onChange={(e) => setStartsAt(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
                                Fecha fin (opcional)
                            </label>
                            <input
                                type="datetime-local"
                                value={endsAt}
                                onChange={(e) => setEndsAt(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Activo */}
                    <div className="flex items-center gap-2">
                        <input
                            id="active"
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                        />
                        <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">
                            Cupón activo
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-black dark:bg-blue-600 text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
                            disabled={saving}
                        >
                            {saving ? "Creando..." : "Crear cupón"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}