// src/components/Checkout/OrderReview.jsx
import { FiMapPin, FiCreditCard, FiPackage, FiCheckCircle } from "react-icons/fi";

export default function OrderReview({
  shippingData,
  paymentData,
  onPrev,
  onConfirm,
  loading,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Revisar Pedido
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verifica que toda la información sea correcta
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        
        {/* Datos de Envío */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <FiMapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Datos de Envío
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Nombre:</span>
                  <span>{shippingData.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <span>{shippingData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Teléfono:</span>
                  <span>{shippingData.phone}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-medium mb-1">Dirección de entrega:</p>
                  <p>{shippingData.address}</p>
                  <p>
                    {shippingData.city}, {shippingData.province}
                  </p>
                  <p>
                    CP: {shippingData.postalCode}, {shippingData.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Método de Pago */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <FiCreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Método de Pago
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tarjeta:</span>
                  <span>**** **** **** {paymentData.cardNumber.replace(/\s/g, "").slice(-4)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Titular:</span>
                  <span>{paymentData.cardHolder}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Vencimiento:</span>
                  <span>{paymentData.expiryDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Entrega */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <FiPackage className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Tiempo de entrega estimado
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                📦 Tu pedido llegará en <strong>5-7 días hábiles</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Recibirás un email con el código de seguimiento una vez que se despache tu pedido
              </p>
            </div>
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              He leído y acepto los{" "}
              <a href="#" className="text-blue-600 hover:underline">
                términos y condiciones
              </a>{" "}
              y la{" "}
              <a href="#" className="text-blue-600 hover:underline">
                política de privacidad
              </a>
            </span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPrev}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Volver
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <FiCheckCircle size={20} />
                <span>Confirmar y Pagar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}