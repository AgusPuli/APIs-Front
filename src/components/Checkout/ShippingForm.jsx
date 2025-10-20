import React from "react";

export default function ShippingForm({ data, setData, onNext }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Datos de Envío
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="Nombre completo"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder="Dirección"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder="Ciudad"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="province"
          value={data.province}
          onChange={handleChange}
          placeholder="Provincia"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="postalCode"
          value={data.postalCode}
          onChange={handleChange}
          placeholder="Código postal"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <input
          name="country"
          value={data.country}
          onChange={handleChange}
          placeholder="País"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      <div className="mt-6 text-right">
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
