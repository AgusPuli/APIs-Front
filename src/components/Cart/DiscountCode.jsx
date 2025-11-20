import { useState } from "react";
import { useDispatch } from "react-redux";
import { applyDiscount } from "../../store/slices/cartSlice";

export default function DiscountCode() {
  const dispatch = useDispatch();
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPreview, setLastPreview] = useState(null);

  const canSend = code.trim().length >= 3 && !loading;

  // Lógica para previsualizar (Solo visual)
  const handlePreview = async () => {
    setLoading(true);
    try {
      // Simulamos llamada a tu backend: POST /cart/discounts/preview
      // Reemplaza esta URL por la real de tu API
      const res = await fetch(`http://localhost:8080/admin/discounts/preview?code=${code}`, {
         method: 'POST' 
      });
      
      if(res.ok) {
          const data = await res.json();
          setLastPreview({ code, ...data });
      } else {
          setLastPreview({ code, message: "Cupón inválido", error: true });
      }
    } catch (error) {
      console.error(error);
      setLastPreview({ code, message: "Error al validar", error: true });
    } finally {
      setLoading(false);
    }
  };

  // Lógica para APLICAR (Impacta en Redux)
  const handleApply = async () => {
    setLoading(true);
    try {
      // Validar contra backend primero
       const res = await fetch(`http://localhost:8080/admin/discounts/preview?code=${code}`, {
         method: 'POST' 
      });
      
      if(res.ok) {
          const data = await res.json();
          //  DESPACHAR A REDUX
          dispatch(applyDiscount({ 
              code: code, 
              amount: data.discountAmount || 0 
          }));
          // Limpiar input o mostrar éxito
          setLastPreview({ code, message: "Cupón aplicado correctamente", discountAmount: data.discountAmount });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Cupon de Descuento
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Ingresa tu codigo (p. ej., BLACK25)"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex gap-2">
          <button
            disabled={!canSend}
            onClick={handlePreview}
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
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
          <p>
            <span className="font-semibold text-gray-900 dark:text-white">
              Codigo:
            </span>{" "}
            {lastPreview.code}
          </p>

          {lastPreview.message && (
            <p className={`text-xs mt-1 ${lastPreview.error ? "text-red-500" : "text-gray-500"}`}>
                {lastPreview.message}
            </p>
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