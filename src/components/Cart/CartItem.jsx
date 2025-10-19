// src/components/Cart/CartItem.jsx
import { useState } from "react";
import { FiTrash, FiMinus, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CartItem({ product, onQuantityChange, onDelete }) {
  const [quantity, setQuantity] = useState(product.quantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(product.id, newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(product.id, newQty);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar ${product.name} del carrito?`)) {
      onDelete(product.id);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      
      {/* Imagen del producto */}
      <Link 
        to={`/product/${product.productId}`}
        className="flex-shrink-0"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:opacity-75 transition-opacity"
          />
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Sin imagen</span>
          </div>
        )}
      </Link>

      {/* Información del producto */}
      <div className="flex-grow min-w-0 w-full sm:w-auto">
        <Link 
          to={`/product/${product.productId}`}
          className="block"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Variantes */}
        <div className="flex flex-wrap gap-3 mb-3">
          {product.selectedColor && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Color:</span>
              <div
                className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: product.selectedColor }}
                title={product.selectedColor}
              />
            </div>
          )}
          {product.selectedStorage && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Almacenamiento:</span> {product.selectedStorage}
            </div>
          )}
        </div>

        {/* Precio unitario */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          ${product.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">c/u</span>
        </p>

        {/* Controles de cantidad - Móvil */}
        <div className="flex items-center gap-4 sm:hidden">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrease}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Disminuir cantidad"
            >
              <FiMinus size={16} />
            </button>
            <span className="px-4 py-2 font-medium bg-white dark:bg-gray-800 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Aumentar cantidad"
            >
              <FiPlus size={16} />
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Eliminar del carrito"
          >
            <FiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Controles de cantidad - Desktop */}
      <div className="hidden sm:flex items-center gap-4 ml-auto">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={handleDecrease}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Disminuir cantidad"
          >
            <FiMinus size={16} />
          </button>
          <span className="px-4 py-2 font-medium bg-white dark:bg-gray-800 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Aumentar cantidad"
          >
            <FiPlus size={16} />
          </button>
        </div>

        <div className="w-24 text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          aria-label="Eliminar del carrito"
        >
          <FiTrash size={20} />
        </button>
      </div>

      {/* Precio total - Móvil */}
      <div className="sm:hidden w-full pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}