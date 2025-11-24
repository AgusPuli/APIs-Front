import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import CartItem from "./CartItem";

export default function CartList() {
  // Leemos los items directamente de Redux
  const { items } = useSelector((state) => state.cart);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="mb-6">
          <FiShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Agregá productos para comenzar tu compra
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        >
          <FiShoppingBag size={20} />
          <span>Ir a Productos</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Productos en tu Carrito
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          // Usamos una key única y pasamos el item al componente hijo
          <CartItem 
            key={item.id || item.productId || Math.random()} 
            item={item} 
          />
        ))}
      </div>
    </div>
  );
}