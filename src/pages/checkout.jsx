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
  const { items, clearCart, subtotal, discountAmount, appliedCoupon } = useCart();
  const { token, user } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Datos de envío
  const [shippingData, setShippingData] = useState({
    fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Argentina",
  });

  // Datos de pago (solo para UI; backend espera un PaymentRequest separado)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // Totales
  const total = subtotal - discountAmount;

  // Enviar orden y luego registrar el pago
  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Debes iniciar sesión para finalizar la compra");
      return;
    }

    setLoading(true);
    try {
      // 1) Crear la orden (endpoint que ya tenés)
      // Nota: tu backend usa el carrito del usuario, por eso hacemos POST sin body normalmente.
      // Si tu OrdersController acepta body, se puede enviar, pero aquí mantenemos el POST "normal".
      const res = await fetch("http://localhost:8080/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Si tu backend no acepta body para checkout, podés remover body.
        // body: JSON.stringify({ /* opcional */ }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Error al crear orden:", errText);
        throw new Error("Error al crear la orden");
      }

      const order = await res.json();
      console.log("✅ Orden creada:", order);

      // 2) Registrar el pago en /payments (PAYMENT REQUEST)
      // Aquí mandamos siempre el mismo DTO para pruebas:
      const paymentPayload = {
        orderId: order.id,
        amount: order.total ?? total, // usa el total que venga del backend o el calculado en front
        method: "CREDIT_CARD",
        status: "COMPLETED",
      };

      // ---------- AQUI se llama al endpoint /payments ----------
      // Endpoint: POST http://localhost:8080/payments
      // Body JSON enviado: paymentPayload (ver arriba)
      const payRes = await fetch("http://localhost:8080/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload),
      });
      // --------------------------------------------------------

      if (!payRes.ok) {
        const errText = await payRes.text();
        console.error("❌ Error al registrar pago:", errText);
        // no abortamos limpieza/redirección automáticamente: lanzamos error para avisar al usuario
        throw new Error("Error al registrar el pago");
      }

      const payment = await payRes.json();
      console.log("💳 Pago procesado:", payment);

      // 3) Limpiar carrito y redirigir a detalle de orden
      if (typeof clearCart === "function") {
        await clearCart();
      } else {
        console.warn("clearCart no está disponible en useCart()");
      }

      navigate(`/orders/${order.id}`);

    } catch (err) {
      console.error("❌ Error general en checkout/pago:", err);
      alert("No se pudo completar el pedido. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Validaciones por paso
  const handleNextStep = () => {
    if (currentStep === 1 && !shippingData.fullName) {
      alert("Completá tus datos de envío.");
      return;
    }
    if (currentStep === 2 && !paymentData.cardNumber) {
      alert("Completá los datos de pago.");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  // UI
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

          <CheckoutSteps currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Formularios */}
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

            {/* Resumen */}
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
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </p>
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
                    <span>
                      {appliedCoupon?.code ? `Descuento (${appliedCoupon.code})` : "Descuento"}
                    </span>
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
