import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../Context/CartContext";

export default function ProductCard({ product }) {
  const [imageUrl, setImageUrl] = useState("/placeholder.jpg");
  const { updateQuantity } = useCart();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/products/${product.id}/image/raw`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.warn("No se pudo cargar la imagen del producto:", err);
        setImageUrl("/placeholder.jpg");
      }
    };

    if (product?.id) fetchImage();

    return () => {
      if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateQuantity(product.id, 1, "add");
    } catch (err) {
      console.error("Error al agregar producto al carrito:", err);
    }
  };

  const isActive = Boolean(product?.active);
  const isOutOfStock = product?.stock === 0;

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
        className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        onError={(e) => (e.target.src = "/placeholder.jpg")}
      />

      {/* Si está deshabilitado */}
      {!isActive && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">No disponible</span>
        </div>
      )}

      {/* Si está sin stock */}
      {isOutOfStock && isActive && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
          Sin stock
        </div>
      )}
    </div>

    {/* Info */}
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {product.name}
      </h3>

      {product.category && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {product.category}
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price?.toLocaleString("es-AR")}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
          >
            <FiEye size={18} />
            <span className="text-sm">Ver</span>
          </Link>

          <button
            onClick={isActive && !isOutOfStock ? handleAddToCart : undefined}
            disabled={!isActive || isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-md ${
              isActive && !isOutOfStock
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FiShoppingCart size={18} />
            <span className="text-sm">
              {!isActive
                ? "No disponible"
                : isOutOfStock
                ? "Sin stock"
                : "Agregar"}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
