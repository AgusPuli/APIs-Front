import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "../Context/SessionContext";
import { useCart } from "../Context/CartContext";
import { motion } from "framer-motion";

export default function ProductInfo({ product }) {
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  const { token } = useSession();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Debes iniciar sesión para añadir productos al carrito");
      return;
    }

    const payload = {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      selectedColor,
      selectedStorage,
      quantity: 1,
      imageUrl: product.images?.[0] || "",
    };

    addItem(payload);
    toast.success(`Producto "${product.name}" añadido al carrito`);
  };

  return (
    <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
      <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
      <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>

      {/* Selectores de almacenamiento */}
      {product.storageOptions && (
        <div>
          <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">Almacenamiento</p>
          <div className="flex flex-wrap gap-2">
            {product.storageOptions.map((s) => (
              <motion.button
                key={s}
                onClick={() => setSelectedStorage(s)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                  selectedStorage === s
                    ? "border-2 border-primary bg-primary/20 text-primary shadow-lg"
                    : "border-gray-300 text-gray-700 dark:text-gray-200 hover:border-primary hover:shadow-sm"
                }`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Selectores de color */}
      {product.colors && (
        <div>
          <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">Color</p>
          <div className="flex gap-3">
            {product.colors.map((c) => (
              <motion.button
                key={c}
                onClick={() => setSelectedColor(c)}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === c
                    ? "border-4 border-primary shadow-lg"
                    : "border-gray-300 hover:shadow-sm"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Botón añadir al carrito */}
      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg"
      >
        Añadir al carrito
      </motion.button>
    </div>
  );
}
