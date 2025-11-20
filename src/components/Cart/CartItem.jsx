import { useDispatch } from "react-redux";
import { FiTrash, FiMinus, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { updateQuantity, removeFromCart } from "../../store/slices/cartSlice"; 

export default function CartItem({ item }) {
  const dispatch = useDispatch(); 

  // 1. STOCK: Lo tomamos directo del objeto (ya no hacemos fetch)
  // Si esto da 0 o error, recuerda vaciar el carrito y volver a agregar productos
  const productStock = item.stock || 0; 
  const loadingStock = false; // Ya no hay carga, el dato es inmediato

  // Validación para el botón (+)
  const canIncrement = item.quantity < productStock;

  const handleDecrease = () => {
    if (item.quantity <= 1) return;
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
  };

  const handleIncrease = () => {
    if (!canIncrement) return;
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar ${item.name} del carrito?`)) {
      dispatch(removeFromCart(item.id));
    }
  };

  const totalPrice = item.price * item.quantity;

  // 2. IMAGEN: URL directa al backend (sin lógica compleja)
  const API_URL = "http://localhost:8080";
  const imageSrc = `${API_URL}/products/${item.id}/image/raw`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">

      {/* Imagen del producto */}
      <Link to={`/product/${item.id}`} className="flex-shrink-0">
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            // Protección contra bucle de error en imagen
            e.target.onerror = null; 
            e.target.src = "/placeholder.jpg";
          }}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-gray-200 dark:border-gray-700 hover:opacity-75 transition-opacity"
        />
      </Link>

      {/* Información del producto */}
      <div className="flex-grow min-w-0 w-full sm:w-auto">
        <Link to={`/product/${item.id}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {item.name}
          </h3>
        </Link>

        {/* Precio unitario */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ${item.price?.toFixed(2)}{" "}
          <span className="text-sm font-normal text-gray-500">c/u</span>
        </p>

        {/* Indicador de stock */}
        <p className={`text-xs font-medium mb-3 ${
          productStock > 10 
            ? "text-green-600 dark:text-green-400" 
            : productStock > 0 
            ? "text-orange-600 dark:text-orange-400" 
            : "text-red-600 dark:text-red-400"
        }`}>
          {productStock > 10 
            ? "En stock" 
            : productStock > 0 
            ? `Solo quedan ${productStock} unidades` 
            : "Sin stock"}
        </p>

        {/* Controles - Mobile */}
        <div className="flex items-center gap-4 sm:hidden">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMinus size={16} />
            </button>
            <span className="px-4 py-2 font-medium bg-white dark:bg-gray-800 min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={!canIncrement}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={16} />
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Controles - Desktop */}
      <div className="hidden sm:flex items-center gap-4 ml-auto">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiMinus size={16} />
          </button>
          <span className="px-4 py-2 font-medium bg-white dark:bg-gray-800 min-w-[3rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={!canIncrement}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus size={16} />
          </button>
        </div>

        <div className="w-24 text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <FiTrash size={20} />
        </button>
      </div>
    </div>
  );
}