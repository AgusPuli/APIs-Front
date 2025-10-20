import { useState } from "react";

/**
 * Componente de cupón de descuento
 * - onPreview(code): ejecuta POST /cart/discounts/preview
 * - onApply(code): ejecuta POST /cart/discounts/apply
 * - loading: indica si está cargando
 * - lastPreview: muestra el resultado de la previsualización
 */
export default function DiscountCode({
  onPreview,
  onApply,
  loading = false,
  lastPreview,
}) {
  const [code, setCode] = useState("");

  const canSend = code.trim().length >= 3 && !loading;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Cupón de Descuento
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Input */}
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ingresá tu código (p. ej., BLACK25)"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Botones */}
        <div className="flex gap-2">
          <button
            disabled={!canSend}
            onClick={() => onPreview(code)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              canSend
                ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "..." : "Previsualizar"}
          </button>

          <button
            disabled={!canSend}
            onClick={() => onApply(code)}
            className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition-all ${
              canSend
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "..." : "Aplicar"}
          </button>
        </div>
      </div>

      {/* Resultado de la previsualización */}
      {lastPreview && (
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
          <p>
            <span className="font-semibold text-gray-900 dark:text-white">
              Código:
            </span>{" "}
            {lastPreview.code}
          </p>

          {lastPreview.message && (
            <p className="text-xs text-gray-500 mt-1">{lastPreview.message}</p>
          )}

          {typeof lastPreview.discountAmount === "number" && (
            <p className="font-medium text-green-600 dark:text-green-400 mt-1">
              Descuento estimado: ${lastPreview.discountAmount.toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
