import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux"; 
import CartList from "../components/Cart/CartList";
import OrderSummary from "../components/Cart/OrderSummary";
import DiscountCode from "../components/Cart/DiscountCode";
import { updateQuantity, removeFromCart, clearCart } from "../store/slices/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();

  const { items, loading, total, discount, discountCode } = useSelector((state) => state.cart);

  const handleClearCart = () => {
      if(window.confirm("¿Estás seguro de vaciar el carrito?")) {
          dispatch(clearCart());
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-end">
            <div>
                <Link
                to="/products"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-4 transition-colors"
                >
                <FiArrowLeft size={20} />
                <span>Continuar Comprando</span>
                </Link>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Carrito de Compras
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                {items.length} {items.length === 1 ? "producto" : "productos"} en tu carrito
                </p>
            </div>
            {items.length > 0 && (
                <button 
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 text-sm underline"
                >
                    Vaciar Carrito
                </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600 dark:text-gray-400">Cargando carrito...</p>
            </div>
          ) : items.length === 0 ? (
            /* Carrito vacío */
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
          ) : (
            /* Carrito con productos */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de productos + cupón */}
              <div className="lg:col-span-2 space-y-6">
                {/* CartList ya está conectado a Redux internamente, pero le pasamos items por si acaso o dejamos que él los lea */}
                <CartList /> 

                <DiscountCode />
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <OrderSummary />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}