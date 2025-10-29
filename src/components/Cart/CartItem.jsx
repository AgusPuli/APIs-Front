import { useState, useEffect } from "react";
import { FiTrash, FiMinus, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CartItem({ item, onQuantityChange, onDelete }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [productStock, setProductStock] = useState(null);
  const [loadingStock, setLoadingStock] = useState(true);

  // Obtener stock del producto
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`http://localhost:8080/products/${item.productId}`);
        if (res.ok) {
          const product = await res.json();
          setProductStock(product.stock);
        }
      } catch (err) {
        console.error("Error al obtener stock:", err);
      } finally {
        setLoadingStock(false);
      }
    };

    fetchStock();
  }, [item.productId]);

  // Sincronizar quantity cuando item.quantity cambie (por ejemplo, después de fetchCart)
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  // Verificar si se puede incrementar
  const canIncrement = !loadingStock && productStock !== null && quantity < productStock;

  // Disminuir cantidad
  const handleDecrease = () => {
    if (quantity <= 0) return;

    const newQty = quantity - 1;
    setQuantity(newQty);
    onQuantityChange(item.productId, newQty, "remove");
  };

  // Aumentar cantidad
  const handleIncrease = () => {
    if (!canIncrement) return;

    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(item.productId, newQty, "add");
  };

  // Eliminar producto completamente
  const handleDelete = () => {
    if (window.confirm(`¿Eliminar ${item.name} del carrito?`)) {
      onDelete(item.productId);
    }
  };

  const totalPrice = item.price * quantity;

  // Imagen segura del backend
  const imageSrc = item.imageUrl
    ? item.imageUrl
    : `http://localhost:8080/products/${item.productId}/image/raw`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">

      {/* Imagen del producto */}
      <Link to={`/product/${item.productId}`} className="flex-shrink-0">
        <img
          src={imageSrc}
          alt={item.name}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:opacity-75 transition-opacity"
        />
      </Link>

      {/* Información del producto */}
      <div className="flex-grow min-w-0 w-full sm:w-auto">
        <Link to={`/product/${item.productId}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {item.name}
          </h3>
        </Link>

        {/* Variantes */}
        <div className="flex flex-wrap gap-3 mb-3">
          {item.selectedColor && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Color:</span>
              <div
                className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: item.selectedColor }}
                title={item.selectedColor}
              />
            </div>
          )}
          {item.selectedStorage && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Almacenamiento:</span>{" "}
              {item.selectedStorage}
            </div>
          )}
        </div>

        {/* Precio unitario */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ${item.price.toFixed(2)}{" "}
          <span className="text-sm font-normal text-gray-500">c/u</span>
        </p>

        {/* Indicador de stock */}
        {!loadingStock && productStock !== null && (
          <p className={`text-xs font-medium mb-3 ${
            productStock > 10 
              ? "text-green-600 dark:text-green-400" 
              : productStock > 0 
              ? "text-orange-600 dark:text-orange-400" 
              : "text-red-600 dark:text-red-400"
          }`}>
            {productStock > 10 
              ? `✓ En stock` 
              : productStock > 0 
              ? `⚠️ Solo quedan ${productStock} unidades` 
              : "❌ Sin stock"}
          </p>
        )}

        {/* Controles - Móvil */}
        <div className="flex items-center gap-4 sm:hidden">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 0}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMinus size={16} />
            </button>
            <span className="px-4 py-2 font-medium bg-white dark:bg-gray-800 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={!canIncrement}
              title={!canIncrement ? "Stock máximo alcanzado" : ""}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={16} />
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Controles - Desktop */}
      <div className="hidden sm:flex items-center gap-4 ml-auto">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 0}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiMinus size={16} />
          </button>
          <span className="px-4 py-2 font-medium bg-white dark:bg-gray-800 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={!canIncrement}
            title={!canIncrement ? "Stock máximo alcanzado" : ""}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        >
          <FiTrash size={20} />
        </button>
      </div>

      {/* Subtotal - Móvil */}
      <div className="sm:hidden w-full pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Subtotal:
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}