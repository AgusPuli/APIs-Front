import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../Context/CartContext.jsx";

export default function CartButton() {
  const { items } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const displayCount = itemCount > 10 ? "10+" : itemCount;

  return (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover-lift"
      aria-label={`Carrito de compras: ${itemCount} items`}
    >
      <FiShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
          {displayCount}
        </span>
      )}
    </Link>
  );
}