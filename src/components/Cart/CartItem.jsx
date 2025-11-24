import { useDispatch } from "react-redux";
import { FiTrash, FiMinus, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { updateQuantity, removeFromCart, addToCart } from "../../store/slices/cartSlice"; 

export default function CartItem({ item }) {
  const dispatch = useDispatch(); 

  // 🛑 CORRECCIÓN CRÍTICA DE ID:
  // Priorizamos item.product.id o item.productId. 
  // Evitamos usar item.id porque suele ser el ID del renglón del carrito, no del producto.
  const productId = item.product?.id || item.productId;

  // Si por alguna razón no hay ID de producto, no renderizamos para evitar errores
  if (!productId) {
      console.error("Item sin Product ID:", item);
      return null; 
  }

  const productStock = item.stock || item.product?.stock || 0;
  const canIncrement = item.quantity < productStock;

  const handleDecrease = () => {
    if (item.quantity <= 1) return;
    // Enviamos productId (ID del producto), no item.id
    dispatch(updateQuantity({ productId, quantity: item.quantity - 1 }));
  };

  const handleIncrease = () => {
    if (!canIncrement) return;
    // Enviamos productId (ID del producto)
    dispatch(updateQuantity({ productId, quantity: item.quantity + 1 }));
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar ${item.name}?`)) {
       dispatch(removeFromCart(productId));
    }
  };

  const totalPrice = item.price * item.quantity;
  const API_URL = "http://localhost:8080";
  const imageSrc = `${API_URL}/products/${productId}/image/raw`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700">
      {/* ... (Resto del renderizado igual, usando imageSrc y productId en el Link) ... */}
      <Link to={`/product/${productId}`} className="flex-shrink-0">
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:opacity-75 transition-opacity"
        />
      </Link>

      <div className="flex-grow min-w-0 w-full sm:w-auto">
        <Link to={`/product/${productId}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ${item.price?.toFixed(2)} <span className="text-sm font-normal text-gray-500">c/u</span>
        </p>
        <p className={`text-xs font-medium mb-3 ${productStock > 0 ? "text-green-600" : "text-red-600"}`}>
          {productStock > 10 ? "En stock" : productStock > 0 ? `Quedan ${productStock}` : "Sin stock"}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button onClick={handleDecrease} disabled={item.quantity <= 1} className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50">
              <FiMinus size={16} />
            </button>
            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{item.quantity}</span>
            <button onClick={handleIncrease} disabled={!canIncrement} className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50">
              <FiPlus size={16} />
            </button>
          </div>
          <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
            <FiTrash size={20} />
          </button>
        </div>
      </div>
      <div className="hidden sm:block w-24 text-right">
         <p className="text-lg font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}