import React from "react";

export default function PaymentForm({ data, setData, onNext, onPrev }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Método de Pago
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="cardHolder"
          value={data.cardHolder}
          onChange={handleChange}
          placeholder="Titular de la tarjeta"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="cardNumber"
          value={data.cardNumber}
          onChange={handleChange}
          placeholder="Número de tarjeta"
          maxLength="16"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="expiryDate"
          value={data.expiryDate}
          onChange={handleChange}
          placeholder="MM/AA"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="cvv"
          value={data.cvv}
          onChange={handleChange}
          placeholder="CVV"
          maxLength="4"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          name="saveCard"
          checked={data.saveCard}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Guardar esta tarjeta para futuras compras
        </label>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-5 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
