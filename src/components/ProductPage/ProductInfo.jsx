import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// canBuy es opcional; si no lo mandan, lo inferimos de product.active Y el stock
export default function ProductInfo({ product, canBuy: canBuyProp }) {
  // Estados locales para variantes
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  // Hooks de Redux y Router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Leer estado global
  const { token } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.cart);

  // --- LÓGICA DE DISPONIBILIDAD CORREGIDA ---
  const isActive = Boolean(product?.active);
  const hasStock = product?.stock > 0;

  // Determinar si se puede comprar: Debe estar activo Y tener stock
  const canBuy = typeof canBuyProp === "boolean"
    ? canBuyProp
    : (isActive && hasStock);

  const handleAddToCart = async () => {
    if (!canBuy) {
      if (!isActive) toast.error("Este producto no está disponible");
      else if (!hasStock) toast.error("Producto sin stock");
      return;
    }

    // 1. Validación de Autenticación con Redux
    if (!token) {
      toast.error("Debes iniciar sesión para añadir productos al carrito");
      navigate("/login");
      return;
    }

    // 2. Disparar acción al Store
    try {
      await dispatch(addToCart({ 
        productId: product.id, 
        quantity: 1 
      })).unwrap();

      toast.success("Producto agregado al carrito");
    } catch (err) {
      console.error("Error al agregar:", err);
      toast.error(typeof err === 'string' ? err : "Error al agregar al carrito");
    }
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
          
          {/* --- ETIQUETAS DE ESTADO CORREGIDAS --- */}
          {isActive && hasStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Disponible
            </span>
          ) : isActive && !hasStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
              Sin Stock
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              No disponible
            </span>
          )}
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {product.description}
      </p>

      {/* Selector de Almacenamiento (Si existe) */}
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
                disabled={!canBuy}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedStorage === opt
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400"
                    : "border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300"
                } ${!canBuy ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Color (Si existe) */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">
            Color
          </p>
          <div className="flex gap-3">
            {product.colors.map((c, idx) => (
              <motion.button
                key={`${c}-${idx}`}
                onClick={() => setSelectedColor(c)}
                whileTap={{ scale: 0.9 }}
                disabled={!canBuy}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === c
                    ? "border-4 border-blue-500 shadow-lg"
                    : "border-gray-300 hover:shadow-sm dark:border-gray-600"
                } ${!canBuy ? "opacity-60 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}

      {/* Botón añadir al carrito */}
      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: canBuy && !loading ? 1.02 : 1 }}
        whileTap={{ scale: canBuy && !loading ? 0.98 : 1 }}
        disabled={loading || !canBuy}
        className={`mt-4 w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg ${
          loading || !canBuy
            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando...
          </span>
        ) : !isActive ? (
          "No disponible"
        ) : !hasStock ? (
          "Sin Stock"
        ) : (
          "Agregar al Carrito"
        )}
      </motion.button>
      
      {/* Stock info (Solo si hay stock bajo pero mayor a 0) */}
      {hasStock && product.stock < 10 && (
         <p className="text-sm text-orange-600 dark:text-orange-400 mt-2 text-center">
            ¡Apurate! Solo quedan {product.stock} unidades.
         </p>
      )}
    </div>
  );
}