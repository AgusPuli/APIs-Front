import { useState } from "react";
import { FiCreditCard, FiLock } from "react-icons/fi";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";

export default function PaymentForm({ data, setData, onNext, onPrev }) {
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue = value;
    
    // Formatear número de tarjeta (espacios cada 4 dígitos)
    if (name === "cardNumber") {
      newValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      newValue = newValue.slice(0, 19); // Máximo 16 dígitos + 3 espacios
    }
    
    // Formatear fecha de expiración (MM/AA)
    if (name === "expiryDate") {
      newValue = value.replace(/\D/g, "");
      if (newValue.length >= 2) {
        newValue = newValue.slice(0, 2) + "/" + newValue.slice(2, 4);
      }
      newValue = newValue.slice(0, 5);
    }
    
    // Solo números en CVV
    if (name === "cvv") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  // Detectar tipo de tarjeta
  const getCardType = () => {
    const number = data.cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    return "default";
  };

  const cardType = getCardType();

  const CardIcon = () => {
    switch (cardType) {
      case "visa":
        return <SiVisa className="w-12 h-12 text-blue-600" />;
      case "mastercard":
        return <SiMastercard className="w-12 h-12 text-red-600" />;
      case "amex":
        return <SiAmericanexpress className="w-12 h-12 text-blue-500" />;
      default:
        return <FiCreditCard className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tarjeta de Credito Visual */}
      <div className="perspective-1000">
        <div 
          className={`relative w-full h-56 rounded-2xl shadow-2xl transition-transform duration-700 ${
            focusedField === "cvv" ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          
          {/* Frente de la tarjeta */}
          <div 
            className={`absolute inset-0 rounded-2xl p-6 text-white backface-hidden ${
              cardType === "visa" ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" :
              cardType === "mastercard" ? "bg-gradient-to-br from-red-600 via-red-700 to-red-900" :
              cardType === "amex" ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800" :
              "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900"
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Chip */}
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md opacity-80" />
              <CardIcon />
            </div>

            {/* Número de tarjeta */}
            <div className="mb-5">
              <div 
                className={`text-2xl font-mono tracking-wider transition-all duration-300 ${
                  focusedField === "cardNumber" ? "scale-105" : ""
                }`}
              >
                {data.cardNumber || "#### #### #### ####"}
              </div>
            </div>

            {/* Holder y Fecha */}
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <div className="text-xs opacity-70 mb-1">TITULAR</div>
                <div 
                  className={`text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                    focusedField === "cardHolder" ? "scale-105" : ""
                  }`}
                >
                  {data.cardHolder || "NOMBRE APELLIDO"}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-70 mb-1 text-right">VENCE</div>
                <div 
                  className={`text-sm font-mono transition-all duration-300 ${
                    focusedField === "expiryDate" ? "scale-105" : ""
                  }`}
                >
                  {data.expiryDate || "MM/AA"}
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          </div>

          {/* Reverso de la tarjeta */}
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white rotate-y-180"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            {/* Banda magnética */}
            <div className="w-full h-12 bg-gray-900 mt-6" />
            
            {/* CVV */}
            <div className="px-6 mt-6">
              <div className="bg-white h-10 rounded flex items-center justify-end px-4">
                <span className="text-gray-800 font-mono text-lg tracking-widest">
                  {data.cvv || "***"}
                </span>
              </div>
              <p className="text-xs mt-2 opacity-70">Código de seguridad</p>
            </div>

            <div className="absolute bottom-6 right-6 opacity-50">
              <CardIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <FiLock className="text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Información de Pago
          </h2>
        </div>

        <div className="space-y-4">
          {/* Numero de tarjeta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número de Tarjeta *
            </label>
            <div className="relative">
              <input
                name="cardNumber"
                value={data.cardNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField("cardNumber")}
                onBlur={() => setFocusedField("")}
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Titular */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titular de la Tarjeta *
            </label>
            <input
              name="cardHolder"
              value={data.cardHolder}
              onChange={handleChange}
              onFocus={() => setFocusedField("cardHolder")}
              onBlur={() => setFocusedField("")}
              placeholder="JUAN PÉREZ"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Fecha y CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Vencimiento *
              </label>
              <input
                name="expiryDate"
                value={data.expiryDate}
                onChange={handleChange}
                onFocus={() => setFocusedField("expiryDate")}
                onBlur={() => setFocusedField("")}
                placeholder="MM/AA"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CVV *
              </label>
              <input
                name="cvv"
                type="password"
                value={data.cvv}
                onChange={handleChange}
                onFocus={() => setFocusedField("cvv")}
                onBlur={() => setFocusedField("")}
                placeholder="123"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Guardar tarjeta */}
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              name="saveCard"
              id="saveCard"
              checked={data.saveCard}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="saveCard" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Guardar esta tarjeta para futuras compras
            </label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <FiLock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                Tu pago es 100% seguro
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-400">
                Utilizamos encriptación SSL de 256 bits para proteger tu información
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPrev}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
          >
            ← Atrás
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            Revisar Pedido →
          </button>
        </div>
      </div>
    </div>
  );
}