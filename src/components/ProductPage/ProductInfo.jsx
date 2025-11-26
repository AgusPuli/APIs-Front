// src/components/ProductPage/ProductInfo.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import useAddToCart from "../../hooks/useAddToCart";


export default function ProductInfo({ product, canBuy: canBuyProp }) {

  const { addToCart, isAdmin } = useAddToCart();
  
  // Estados locales para variantes del producto
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  // Estados del producto
  const isActive = Boolean(product?.active);
  const hasStock = product?.stock > 0;
  
  // Determinar si se puede comprar
  const canBuy = typeof canBuyProp === "boolean"
    ? canBuyProp
    : (isActive && hasStock);

  //  Handler que usa hook
  const handleAddToCart = async () => {
    await addToCart(product, 1);
  };

  // Determinar badge de disponibilidad
  const getAvailabilityBadge = () => {
    if (isActive && hasStock) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Disponible
        </span>
      );
    }
    if (isActive && !hasStock) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
          Sin Stock
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        No disponible
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título y Precio */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price?.toLocaleString("es-AR")}
          </span>
          {getAvailabilityBadge()}
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {product.description}
      </p>

      {/* Selector de Almacenamiento */}
      {product.storageOptions && product.storageOptions.length > 0 && (
        <div>
          <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">
            Almacenamiento
          </p>
          <div className="flex flex-wrap gap-3">
            {product.storageOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedStorage(opt)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedStorage === opt
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Color */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">
            Color
          </p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                  selectedColor === color
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Stock disponible: <span className="font-semibold">{product.stock || 0}</span> unidades
      </div>

      {/* Botón Agregar al Carrito */}
      <motion.button
        onClick={handleAddToCart}
        disabled={!canBuy || isAdmin}
        whileHover={canBuy && !isAdmin ? { scale: 1.02 } : {}}
        whileTap={canBuy && !isAdmin ? { scale: 0.98 } : {}}
        className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg ${
          canBuy && !isAdmin
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isAdmin 
          ? "Admin - No disponible" 
          : !isActive 
            ? "Producto no disponible" 
            : !hasStock 
              ? "Sin stock" 
              : "Agregar al carrito"
        }
      </motion.button>

      {/* Información Adicional */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Envío gratis en compras mayores a $50.000</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Garantía oficial del fabricante</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Pago seguro - Todas las tarjetas</span>
        </div>
      </div>
    </div>
  );
}