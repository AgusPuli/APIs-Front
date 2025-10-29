import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function OrderSummary({ 
  subtotal, 
  discountAmount = 0,
  discountLabel = "Cupón",
  isDisabled = false 
}) {
  const navigate = useNavigate();

  const shipping = 0; // Envío gratuito
  const subtotalAfterDiscount = subtotal - discountAmount;
  const total = subtotalAfterDiscount + shipping ;

  const handleCheckout = () => {
    if (!isDisabled) {
      navigate("/checkout");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Resumen del Pedido
      </h2>

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <p>Subtotal</p>
          <p className="font-semibold">${subtotal.toFixed(2)}</p>
        </div>

        {/* Descuento (si existe) */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <p>{discountLabel}</p>
            <p className="font-semibold">-${discountAmount.toFixed(2)}</p>
          </div>
        )}

        {/* Envío */}
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <p>Envío</p>
          <p className="font-semibold text-green-600 dark:text-green-400">
            {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">Total</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Botón de checkout */}
      <button
        onClick={handleCheckout}
        disabled={isDisabled}
        className={`mt-6 w-full flex items-center justify-center gap-2 h-12 rounded-lg px-6 text-base font-bold text-white shadow-md transition-all ${
          isDisabled
            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5"
        }`}
      >
        <FiShoppingCart size={20} />
        <span>Proceder al Pago</span>
      </button>

      {/* Info adicional */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
          🔒 Pago seguro • 🚚 Envío gratis en compras mayores a $50.000
        </p>
      </div>
    </div>
  );
}