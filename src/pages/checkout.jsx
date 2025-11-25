import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder, resetOrderState } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

// Componentes visuales
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import ShippingForm from "../components/Checkout/ShippingForm";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderReview from "../components/Checkout/OrderReview";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Estado Global con valores por defecto
  const { items = [], total = 0, discount = 0, discountCode } = useSelector((state) => state.cart || {});
  const { authenticated, user } = useSelector((state) => state.user);
  const { loading: orderLoading } = useSelector((state) => state.orders || {});

  // 2. Estados Locales
  const [step, setStep] = useState(1);
  
  // Datos de envío
  const [shippingData, setShippingData] = useState({
    fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name : "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Argentina",
  });

  // Datos de pago
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "CREDIT_CARD",
  });

  // ✅ VALIDACIÓN: Verificar que hay items en el carrito
  useEffect(() => {
    if (!authenticated) {
      toast.error("Debes iniciar sesión para continuar");
      navigate("/login");
      return;
    }

    if (!items || items.length === 0) {
      toast.error("Tu carrito está vacío");
      navigate("/cart");
      return;
    }
  }, [authenticated, items, navigate]);

  // Resetear estado de orden al montar
  useEffect(() => {
    dispatch(resetOrderState());
  }, [dispatch]);

  // Validaciones por paso
  const validateShipping = () => {
    const required = ["fullName", "email", "phone", "address", "city", "province", "postalCode"];
    for (const field of required) {
      if (!shippingData[field] || shippingData[field].trim() === "") {
        toast.error(`El campo ${field} es requerido`);
        return false;
      }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingData.email)) {
      toast.error("Email inválido");
      return false;
    }

    return true;
  };

  const validatePayment = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = paymentData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      toast.error("Número de tarjeta inválido");
      return false;
    }

    if (!cardHolder || cardHolder.trim() === "") {
      toast.error("Titular de la tarjeta es requerido");
      return false;
    }

    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast.error("Fecha de vencimiento inválida (MM/YY)");
      return false;
    }

    if (!cvv || cvv.length < 3) {
      toast.error("CVV inválido");
      return false;
    }

    return true;
  };

  // Navegación entre pasos
  const handleNext = () => {
    if (step === 1 && !validateShipping()) return;
    if (step === 2 && !validatePayment()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ✅ SUBMIT CORREGIDO con validaciones
  const handleSubmitOrder = async () => {
    // Validaciones finales
    if (!user || !user.id) {
      toast.error("Error de sesión. Vuelve a loguearte.");
      navigate("/login");
      return;
    }

    // ✅ Validar que items existe y no está vacío
    if (!items || !Array.isArray(items) || items.length === 0) {
      toast.error("Tu carrito está vacío");
      navigate("/cart");
      return;
    }

    // Validar datos de envío y pago
    if (!validateShipping() || !validatePayment()) {
      return;
    }

    try {
      // A. Preparar Payload de Orden
      const orderPayload = {
        userId: user.id,
        // ✅ Mapear items con validación
        items: items.map(item => {
          const productId = item.product?.id || item.productId || item.id;
          
          if (!productId) {
            throw new Error("Item sin ID de producto válido");
          }

          return {
            productId: productId,
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.price) || 0,
          };
        }),
        subtotal: total,
        discountAmount: discount,
        total: total - discount,
        shippingAddress: shippingData.address,
        shippingCity: shippingData.city,
        shippingProvince: shippingData.province,
        shippingPostalCode: shippingData.postalCode,
        shippingCountry: shippingData.country,
      };

      // B. Preparar Payload de Pago
      const paymentPayload = {
        paymentMethod: paymentData.paymentMethod || "CREDIT_CARD",
        cardNumber: paymentData.cardNumber?.replace(/\s/g, ""),
        cardHolder: paymentData.cardHolder,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
      };

      console.log("📦 Creating order:", orderPayload);

      // C. Disparar Acción
      const result = await dispatch(createOrder({ 
        userId: user.id,
        items: orderPayload.items,
        shippingData,
        paymentData: paymentPayload
      })).unwrap();

      // D. Éxito
      console.log("✅ Order created:", result);
      toast.success(`¡Orden #${result.id} creada con éxito!`);
      
      // E. Limpiar carrito
      dispatch(clearCart());
      
      // F. Redirigir
      if (result.id) {
        navigate(`/orders/${result.id}`);
      } else {
        navigate("/user");
      }

    } catch (error) {
      console.error("❌ Error Checkout:", error);
      
      // Manejar diferentes tipos de error
      let errorMessage = "Hubo un error al procesar el pedido";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
    }
  };

  // ✅ Si no hay items, mostrar mensaje
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tu carrito está vacío
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Barra de Pasos */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Finalizar Compra
          </h1>
          <CheckoutSteps currentStep={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formularios */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PASO 1: Datos de Envío */}
            {step === 1 && (
              <ShippingForm 
                data={shippingData}
                setData={setShippingData}
                onNext={handleNext}
              />
            )}

            {/* PASO 2: Método de Pago */}
            {step === 2 && (
              <PaymentForm 
                data={paymentData}
                setData={setPaymentData}
                onNext={handleNext}
                onPrev={handleBack}
              />
            )}

            {/* PASO 3: Revisión */}
            {step === 3 && (
              <OrderReview 
                items={items}
                shippingData={shippingData}
                paymentData={paymentData}
                subtotal={total}
                discount={discount}
                total={total - discount}
                onPrev={handleBack}
                onConfirm={handleSubmitOrder}
                loading={orderLoading}
              />
            )}
          </div>

          {/* Resumen del Pedido (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Resumen del Pedido
              </h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento {discountCode && `(${discountCode})`}</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ${(total - discount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}