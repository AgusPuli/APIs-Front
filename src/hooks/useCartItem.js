// src/components/Cart/CartItem.jsx
import { FiTrash, FiMinus, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import useCartItem from "../../hooks/useCartItem";
import { getProductImageUrl, handleImageError } from "../../utils/imageUtils";

/**
 * Componente "tonto" de item del carrito
 * Toda la lógica manejada por useCartItem hook
 */
export default function CartItem({ item }) {
  // ✅ Hook maneja toda la lógica del item
  const {
    productId,
    stock,
    totalPrice,
    canIncrease,
    canDecrease,
    hasStock,
    lowStock,
    increase,
    decrease,
    remove
  } = useCartItem(item);

  // Si no hay productId válido, no renderizar
  if (!productId) return null;

  // ✅ Utilidad maneja la URL de imagen
  const imageSrc = getProductImageUrl(productId);

  // Determinar mensaje de stock
  const getStockMessage = () => {
    if (!hasStock) return "Sin stock";
    if (lowStock) return `Quedan ${stock}`;
    return "En stock";
  };

  const getStockColor = () => {
    if (!hasStock) return "text-red-600";
    if (lowStock) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700">
      
      {/* Imagen del Producto */}
      <Link to={`/product/${productId}`} className="flex-shrink-0">
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          onError={handleImageError}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:opacity-75 transition-opacity"
        />
      </Link>

      {/* Información del Producto */}
      <div className="flex-grow min-w-0 w-full sm:w-auto">
        <Link to={`/product/${productId}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
        </Link>
        
        {/* Precio Unitario */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ${item.price?.toFixed(2)} <span className="text-sm font-normal text-gray-500">c/u</span>
        </p>
        
        {/* Stock Status */}
        <p className={`text-xs font-medium mb-3 ${getStockColor()}`}>
          {getStockMessage()}
        </p>

        {/* Controles de Cantidad */}
        <div className="flex items-center gap-4">
          {/* Botones +/- */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={decrease}
              disabled={!canDecrease}
              className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Disminuir cantidad"
            >
              <FiMinus size={16} />
            </button>
            
            <span className="px-4 py-2 font-medium min-w-[3rem] text-center text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            
            <button
              onClick={increase}
              disabled={!canIncrease}
              className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Aumentar cantidad"
            >
              <FiPlus size={16} />
            </button>
          </div>

          {/* Botón Eliminar */}
          <button
            onClick={remove}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Eliminar producto"
          >
            <FiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Precio Total (Desktop) */}
      <div className="hidden sm:block w-24 text-right">
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          ${totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
}