import { useSelector } from "react-redux";
import CartItem from "./CartItem";

export default function CartList() { 
  const { items } = useSelector((state) => state.cart);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">
          No hay productos en el carrito.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}