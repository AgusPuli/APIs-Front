import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder, resetOrderState } from "../store/slices/orderSlice";
import toast from "react-hot-toast";

// Componentes visuales
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import ShippingForm from "../components/Checkout/ShippingForm";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderReview from "../components/Checkout/OrderReview";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Estado Global
  const { items, total, discount, discountCode } = useSelector((state) => state.cart);
  const { authenticated, user } = useSelector((state) => state.user);
  const { loading: orderLoading } = useSelector((state) => state.orders || state.order); // Soporte para ambos nombres de slice

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
    saveCard: false,
  });

  // 3. Validaciones iniciales
  useEffect(() => {
    if (!authenticated) {
      toast.error("Debes iniciar sesión para comprar");
      navigate("/login");
    } else if (items.length === 0) {
      // Solo redirigir si NO estamos cargando una orden exitosa
      toast("El carrito está vacío");
      navigate("/products");
    }
  }, [items, authenticated, navigate]);

  // Limpiar estados al salir
  useEffect(() => {
    return () => { dispatch(resetOrderState()); };
  }, [dispatch]);

  // Navegación entre pasos
  const nextStep = () => {
    // Validaciones simples antes de avanzar
    if (step === 1) {
        if(!shippingData.address || !shippingData.phone) return toast.error("Completa la dirección y teléfono");
    }
    if (step === 2) {
        if(!paymentData.cardNumber || !paymentData.cvv) return toast.error("Completa los datos de pago");
    }
    setStep((prev) => prev + 1);
  };
  
  const prevStep = () => setStep((prev) => prev - 1);

  // 4. CONFIRMAR COMPRA
  const handleConfirmOrder = async () => {
    if (!user?.id) {
        toast.error("Error de sesión. Vuelve a loguearte.");
        return;
    }

    // A. Preparar Payload de Orden
    const orderPayload = {
        userId: user.id,
        // Enviamos items limpios (solo IDs y cantidades)
        items: items.map(item => ({
            productId: item.id || item.productId, // Maneja ambos casos por seguridad
            quantity: Number(item.quantity),
            price: Number(item.price)
        })),
        total: total - discount,
        shippingAddress: {
            ...shippingData,
            // Si tu backend espera un string en lugar de objeto, descomenta esto:
            // address: `${shippingData.address}, ${shippingData.city}` 
        },
        discountCode: discountCode || null
    };

    // B. Preparar Payload de Pago
    const paymentPayload = {
        paymentMethod: "CREDIT_CARD",
        cardDetails: { 
            number: paymentData.cardNumber.replace(/\s/g, ""), // Limpiar espacios
            holder: paymentData.cardHolder
        }
    };

    try {
        // C. Disparar Acción y esperar respuesta (unwrap maneja el throw si falla)
        const result = await dispatch(createOrder({ 
            orderData: orderPayload,
            paymentData: paymentPayload 
        })).unwrap();

        // D. Éxito
        toast.success(`¡Orden #${result.id} creada con éxito!`);
        navigate("/user"); // Redirigir a historial de órdenes

    } catch (errMessage) {
        // E. Error (Muestra el mensaje que viene del backend o del slice)
        console.error("Error Checkout:", errMessage);
        toast.error(typeof errMessage === 'string' ? errMessage : "Hubo un error al procesar el pedido");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Barra de Pasos */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Finalizar Compra</h1>
          <CheckoutSteps currentStep={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Formularios */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <ShippingForm
                data={shippingData}
                setData={setShippingData}
                onNext={nextStep}
              />
            )}
            {step === 2 && (
              <PaymentForm
                data={paymentData}
                setData={setPaymentData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {step === 3 && (
              <OrderReview
                shippingData={shippingData}
                paymentData={paymentData}
                onPrev={prevStep}
                onConfirm={handleConfirmOrder}
                loading={orderLoading}
              />
            )}
          </div>

          {/* Columna Derecha: Resumen Flotante */}
          <div className="hidden lg:block">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm sticky top-24 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Resumen del Pedido</h3>
                
                {/* Lista compacta de items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {items.map(item => (
                      <div key={item.id || item.productId} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex gap-2 items-start">
                             <span className="font-medium text-gray-900 dark:text-white shrink-0">x{item.quantity}</span>
                             <span className="truncate max-w-[140px] leading-tight" title={item.name}>{item.name}</span>
                          </div>
                          <span className="shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                  ))}
                </div>
                
                {/* Totales */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Descuento</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">
                        <span>Total a Pagar</span>
                        <span className="text-blue-600 dark:text-blue-400">${(total - discount).toFixed(2)}</span>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}