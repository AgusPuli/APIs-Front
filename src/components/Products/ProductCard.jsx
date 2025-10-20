import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ product }) {
  const [imageUrl, setImageUrl] = useState("/placeholder.jpg");

  // 🔹 Cargar imagen desde el backend
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`http://localhost:8080/products/${product.id}/image/raw`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.warn("⚠️ No se pudo cargar la imagen del producto:", err);
        setImageUrl("/placeholder.jpg");
      }
    };

    if (product?.id) fetchImage();

    // Limpieza al desmontar
    return () => {
      if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
  }, [product?.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`🛒 Producto "${product.name}" añadido al carrito`);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">

      {/* Imagen del producto */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info del producto */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.category && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium">📁</span> {product.category}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${product.price?.toLocaleString("es-AR")}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
            >
              <FiEye size={18} />
              <span className="text-sm">Ver</span>
            </Link>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <FiShoppingCart size={18} />
              <span className="text-sm">Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
