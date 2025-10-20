import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/Context/CartContext";
import { useSession } from "../components/Context/SessionContext";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import ShippingForm from "../components/Checkout/ShippingForm";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderReview from "../components/Checkout/OrderReview";
import { FiLock } from "react-icons/fi";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { token, isLoggedIn } = useSession();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Datos de envío
  const [shippingData, setShippingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Argentina"
  });

  // Datos de pago
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    saveCard: false
  });

  // Cupón de descuento
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(null);

  // Cálculos
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discountApplied ? (subtotal * discountApplied.percent) / 100 : 0;
  const total = subtotal - discountAmount;

  // Verificar que el usuario esté logueado
/*   useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
    }
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [isLoggedIn, items, navigate]); */

  // Aplicar cupón de descuento
  const applyDiscount = () => {
    // Simulación - en producción esto debería validarse con el backend
    if (discountCode.toUpperCase() === "DESCUENTO10") {
      setDiscountApplied({ code: discountCode, percent: 10 });
      alert("¡Cupón aplicado! 10% de descuento");
    } else if (discountCode.toUpperCase() === "DESCUENTO15") {
      setDiscountApplied({ code: discountCode, percent: 15 });
      alert("¡Cupón aplicado! 15% de descuento");
    } else {
      alert("Cupón inválido");
    }
  };

  // Procesar orden
  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        discountPercent: discountApplied?.percent || 0,
        discountCode: discountApplied?.code || null,
        total: total.toFixed(2),
        items: items.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor || null,
          selectedStorage: item.selectedStorage || null
        })),
        shippingAddress: shippingData,
        payment: {
          method: "CREDIT_CARD",
          cardLast4: paymentData.cardNumber.slice(-4),
          cardHolder: paymentData.cardHolder
        }
      };

      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error("Error al procesar la orden");

      const order = await response.json();
      
      // Limpiar carrito
      await clearCart();
      
      // Redirigir a página de éxito
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la orden. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validar datos de envío
      if (!shippingData.fullName || !shippingData.email || !shippingData.address) {
        alert("Por favor completa todos los campos obligatorios");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validar datos de pago
      if (!paymentData.cardNumber || !paymentData.cardHolder || !paymentData.expiryDate || !paymentData.cvv) {
        alert("Por favor completa todos los datos de pago");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  /*if (!isLoggedIn || items.length === 0) {
    return null;
  }*/

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Finalizar Compra
            </h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiLock size={16} />
              <span className="text-sm">Pago seguro y encriptado</span>
            </div>
          </div>

          {/* Steps */}
          <CheckoutSteps currentStep={currentStep} />

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            {/* Forms */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <ShippingForm
                  data={shippingData}
                  setData={setShippingData}
                  onNext={handleNextStep}
                />
              )}

              {currentStep === 2 && (
                <PaymentForm
                  data={paymentData}
                  setData={setPaymentData}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                />
              )}

              {currentStep === 3 && (
                <OrderReview
                  shippingData={shippingData}
                  paymentData={paymentData}
                  onPrev={handlePrevStep}
                  onConfirm={handlePlaceOrder}
                  loading={loading}
                />
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Resumen del Pedido
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código de Descuento
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="DESCUENTO10"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                      disabled={discountApplied}
                    />
                    <button
                      onClick={applyDiscount}
                      disabled={discountApplied || !discountCode}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Aplicar
                    </button>
                  </div>
                  {discountApplied && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      ✓ Cupón "{discountApplied.code}" aplicado ({discountApplied.percent}% de descuento)
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Descuento ({discountApplied.percent}%)</span>
                      <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Envío</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">Gratis</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}