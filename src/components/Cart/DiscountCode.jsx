import { useState } from "react";
import { useDispatch } from "react-redux";
import { applyDiscount, previewDiscount } from "../../store/slices/cartSlice";
import toast from "react-hot-toast";

export default function DiscountCode() {
  const dispatch = useDispatch();
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPreview, setLastPreview] = useState(null);

  const canSend = code.trim().length >= 3 && !loading;

  const handlePreview = async () => {
    if (!canSend) return;

    setLoading(true);
    try {
      const result = await dispatch(previewDiscount(code)).unwrap();
      setLastPreview({ 
        code, 
        message: "Cupón válido",
        discountAmount: result.discountAmount || result.discount || 0,
        error: false
      });
      toast.success(`Descuento disponible: $${result.discountAmount?.toFixed(2) || 0}`);
    } catch (error) {
      setLastPreview({ 
        code, 
        message: error.message || "Cupón inválido", 
        error: true 
      });
      toast.error(error.message || "Cupón inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!canSend) return;

    setLoading(true);
    try {
      const result = await dispatch(applyDiscount(code)).unwrap();
      
      setLastPreview({ 
        code, 
        message: "Cupón aplicado correctamente",
        discountAmount: result.discount || 0,
        error: false
      });
      
      toast.success("✅ Cupón aplicado correctamente");
      setCode(""); // Limpiar input
    } catch (error) {
      toast.error("❌ " + (error.message || "Error al aplicar el cupón"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Cupón de Descuento
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ingresa tu código (ej: BLACK25)"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex gap-2">
          <button
            disabled={!canSend}
            onClick={handlePreview}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              canSend
                ? "hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                : "opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700"
            }`}
          >
            {loading ? "..." : "Previsualizar"}
          </button>

          <button
            disabled={!canSend}
            onClick={handleApply}
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

      {lastPreview && (
        <div className={`mt-4 text-sm p-3 rounded-lg border ${
          lastPreview.error 
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
            : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        }`}>
          <p className="text-gray-900 dark:text-white">
            <span className="font-semibold">Código:</span> {lastPreview.code}
          </p>

          {lastPreview.message && (
            <p className={`text-xs mt-1 ${
              lastPreview.error 
                ? "text-red-600 dark:text-red-400" 
                : "text-green-600 dark:text-green-400"
            }`}>
              {lastPreview.message}
            </p>
          )}

          {typeof lastPreview.discountAmount === "number" && !lastPreview.error && (
            <p className="font-medium text-green-600 dark:text-green-400 mt-1">
              Descuento: ${lastPreview.discountAmount.toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}