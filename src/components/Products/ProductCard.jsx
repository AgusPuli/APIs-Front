// src/components/Products/ProductCard.jsx
import { memo } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiShoppingCart, FiLock } from "react-icons/fi";
import { useSelector } from "react-redux";
import useAddToCart from "../../hooks/useAddToCart";
import { getProductImageUrl, handleImageError } from "../../utils/imageUtils";


function ProductCard({ product }) {

  const { addToCart, isAdmin } = useAddToCart();
  
  // Solo necesitamos saber si el usuario está autenticado para mostrar estados
  const { user } = useSelector((state) => state.user);


  const imageUrl = getProductImageUrl(product.id);

  // Estados del producto
  const isActive = Boolean(product?.active);
  const isOutOfStock = product?.stock === 0;
  const canPurchase = isActive && !isOutOfStock && !isAdmin;

  // Handler simplificado
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product);
  };

  // Determinar texto del botón
  const getButtonText = () => {
    if (isAdmin) return "Admin";
    if (!isActive) return "No disp.";
    if (isOutOfStock) return "Sin stock";
    return "Agregar";
  };

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 overflow-hidden border flex flex-col ${
        isActive 
          ? "hover:shadow-xl border-gray-100 dark:border-gray-700" 
          : "opacity-70 grayscale border-gray-300 dark:border-gray-600"
      }`}
    >
      {/* Imagen */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={handleImageError}
        />
        
        {/* Badges de estado */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">No disponible</span>
          </div>
        )}
        
        {isOutOfStock && isActive && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
            Sin stock
          </div>
        )}
        
        {isAdmin && (
          <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
            <FiLock size={10} /> Admin
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {product.category}
        </p>
        
        {/* Precio y acciones */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${product.price?.toLocaleString("es-AR")}
            </span>
          </div>
          
          <div className="flex gap-2">
            {/* Botón Ver */}
            <Link 
              to={`/product/${product.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
            >
              <FiEye size={18} />
              <span className="text-sm">Ver</span>
            </Link>
            
            {/* Botón Agregar al Carrito */}
            <button 
              onClick={handleAddToCart}
              disabled={!canPurchase}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
                canPurchase
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700" 
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isAdmin ? <FiLock size={18} /> : <FiShoppingCart size={18} />}
              <span className="text-sm">{getButtonText()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);