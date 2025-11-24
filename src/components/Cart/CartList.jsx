import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../../store/slices/cartSlice";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

export default function CartList() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  // ✏️ ACTUALIZAR CANTIDAD
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    dispatch(updateQuantity({ productId, quantity: newQuantity }))
      .unwrap()
      .then(() => toast.success("Cantidad actualizada"))
      .catch((err) => toast.error(err));
  };

  // 🗑️ ELIMINAR PRODUCTO
  const handleRemove = (productId, productName) => {
    if (window.confirm(`¿Eliminar "${productName}" del carrito?`)) {
      dispatch(removeFromCart(productId))
        .unwrap()
        .then(() => toast.success("Producto eliminado"))
        .catch((err) => toast.error(err));
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Productos en tu Carrito
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            {/* Imagen del producto */}
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={item.imageUrl || "/placeholder-product.png"}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Info del producto */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${item.price.toFixed(2)} c/u
              </p>

              {/* Controles de cantidad */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={loading || item.quantity <= 1}
                  className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiMinus size={16} />
                </button>
                <span className="font-medium text-gray-900 dark:text-white w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={loading}
                  className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Subtotal y eliminar */}
            <div className="text-right flex flex-col justify-between">
              <p className="font-bold text-gray-900 dark:text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemove(item.id, item.name)}
                disabled={loading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}