import React from "react";

export default function OrderReview({
  shippingData,
  paymentData,
  onPrev,
  onConfirm,
  loading,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Revisión del Pedido
      </h2>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="font-semibold mb-1">Datos de Envío</h3>
          <p>{shippingData.fullName}</p>
          <p>{shippingData.address}</p>
          <p>
            {shippingData.city}, {shippingData.province}
          </p>
          <p>{shippingData.country}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Método de Pago</h3>
          <p>Tarjeta terminada en **** {paymentData.cardNumber.slice(-4)}</p>
          <p>Titular: {paymentData.cardHolder}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-5 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Procesando..." : "Confirmar Pedido"}
        </button>
      </div>
    </div>
  );
}
