import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OrderSummary() {
  const navigate = useNavigate();
  const { total, discount, discountCode, subtotal } = useSelector(
    (state) => state.cart
  );

  // Total que se paga (ya con descuento)
  const discountedTotal = Number(total) || 0;
  const discountAmount = Number(discount) || 0;

  // Subtotal original antes del cupón
  const originalSubtotal =
    subtotal != null && subtotal !== 0
      ? Number(subtotal) || 0
      : discountedTotal + discountAmount;

  const shipping = 0;
  const finalTotal = discountedTotal + shipping;
  const isDisabled = discountedTotal === 0;

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
          <div className="text-right">
            {discountAmount > 0 && (
              <p className="text-xs text-gray-400 line-through">
                ${originalSubtotal.toFixed(2)}
              </p>
            )}
            <p className="font-semibold">
              ${discountedTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Descuento (opcional) */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <p>Cupón {discountCode ? `(${discountCode})` : ""}</p>
            <p className="font-semibold">- ${discountAmount.toFixed(2)}</p>
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
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Total
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${finalTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Botón */}
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

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
          Pago seguro • Envío gratis en compras mayores a $500.00
        </p>
      </div>
    </div>
  );
}
