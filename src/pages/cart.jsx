// src/pages/Cart.jsx
import { Link } from "react-router-dom";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import CartList from "../components/Cart/CartList";
import OrderSummary from "../components/Cart/OrderSummary";
import DiscountCode from "../components/Cart/DiscountCode";
import { useCart } from "../components/Context/CartContext";

export default function Cart() {
  const {
    // Carrito
    items,
    loading,
    updateQuantity,
    removeItem,

    // Totales
    subtotal,
    discountAmount, // calculado en el contexto
    // total, // si lo querés mostrar, ya lo tenés en el contexto

    // Cupones
    lastPreview,
    appliedCoupon,
    loadingDiscount,
    previewCode,
    applyCode,
  } = useCart();

  // Handlers que delegan en el contexto
  const handlePreview = async (code) => {
    try {
      await previewCode(code);
    } catch (e) {
      // Si tu DiscountCode muestra mensajes con lastPreview,
      // podés setear un estado de error ahí. Acá lo dejamos simple.
      console.error(e);
    }
  };

  const handleApply = async (code) => {
    try {
      await applyCode(code);
    } catch (e) {
      console.error(e);
      alert(e?.message || "No se pudo aplicar el cupón");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner"></div>
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
                <CartList
                  items={items}
                  onQuantityChange={updateQuantity}
                  onDelete={removeItem}
                />

                <DiscountCode
                  onPreview={handlePreview}
                  onApply={handleApply}
                  loading={loadingDiscount}
                  lastPreview={lastPreview}
                  appliedCoupon={appliedCoupon}
                />
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <OrderSummary
                    subtotal={subtotal}
                    discountAmount={discountAmount}
                    discountLabel={
                      appliedCoupon?.code ? `Cupón (${appliedCoupon.code})` : "Cupón"
                    }
                    isDisabled={items.length === 0}
                    // total={total} // si tu componente lo soporta
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
