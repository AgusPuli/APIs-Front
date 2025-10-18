import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiShoppingCart, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ProductCard({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay cada 20 segundos
  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % product.images.length);
    }, 20000);

    return () => clearInterval(timer);
  }, [product.images]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Aquí implementarás la lógica del carrito
    console.log("Añadir al carrito:", product);
    alert(`Producto "${product.name}" añadido al carrito`);
  };

  // Si no hay imágenes, usar placeholder
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["/placeholder.jpg"];

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
      
      {/* Badge Featured */}
      {product.featured && (
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
            Destacado
          </span>
        </div>
      )}

      {/* Carrusel de imágenes */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {/* Imagen actual */}
        <img
          src={images[currentIndex]}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover object-center transition-opacity duration-500"
          onError={(e) => {
            // Fallback si la imagen no carga
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Cpath fill='%239ca3af' d='M180 140h40v120h-40zm-20 140h80v20h-80z'/%3E%3C/svg%3E";
          }}
        />

        {/* Flechas de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Imagen anterior"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Imagen siguiente"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? "bg-white w-4" 
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Categoría */}
        {product.category && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium">📁</span> {product.category}
          </p>
        )}

        {/* Subcategorías */}
        {product.subcategories && product.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.subcategories.slice(0, 2).map((sub, idx) => (
              <span 
                key={idx}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {sub}
              </span>
            ))}
            {product.subcategories.length > 2 && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                +{product.subcategories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Opciones de color */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Colores:</span>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-600 dark:text-gray-400">
                  +{product.colors.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Precio y botones */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.storageOptions && product.storageOptions.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {product.storageOptions[0]}
              </span>
            )}
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