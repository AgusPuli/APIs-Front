import { useState } from "react";
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
  const { token, user } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Argentina",
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(null);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discountAmount = discountApplied ? (subtotal * discountApplied.percent) / 100 : 0;
  const total = subtotal - discountAmount;

  // 👉 Procesar orden (llamando al backend)
  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Debes iniciar sesión para finalizar la compra");
      return;
    }

    setLoading(true);
    try {
      // Llamamos al endpoint real del backend
      const res = await fetch("http://localhost:8080/orders/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al crear la orden");
      const order = await res.json();

      // Limpiar carrito
      await clearCart();

      // Redirigir a página de confirmación o a Mis Órdenes
      navigate(`/orders`);
    } catch (err) {
      console.error(err);
      alert("No se pudo completar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Validaciones de pasos
  const handleNextStep = () => {
    if (currentStep === 1 && !shippingData.fullName) {
      alert("Completá tus datos de envío.");
      return;
    }
    if (currentStep === 2 && !paymentData.cardNumber) {
      alert("Completá los datos de pago.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Finalizar Compra
            </h1>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiLock size={16} />
              <span className="text-sm">Pago seguro y encriptado</span>
            </div>
          </div>

          <CheckoutSteps currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
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

            {/* 🧾 Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Resumen del Pedido
                </h2>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cant: {item.quantity}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Descuento</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Total</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
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
