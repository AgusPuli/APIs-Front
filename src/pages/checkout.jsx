import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder, resetOrderState } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

// Importamos tus componentes visuales desde la carpeta components
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import ShippingForm from "../components/Checkout/ShippingForm";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderReview from "../components/Checkout/OrderReview";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Redux: Datos del carrito, usuario y estado de la orden
  const { items, total, discount, discountCode } = useSelector((state) => state.cart);
  const { token, authenticated, user } = useSelector((state) => state.user);
  const { loading: orderLoading, success: orderSuccess, error: orderError } = useSelector((state) => state.order);

  // 2. Estados locales para los formularios
  const [step, setStep] = useState(1);
  
  // Datos de envío (Pre-llenados con datos del usuario si existen)
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

  // Datos de pago
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  // 3. Validaciones al montar: Si no hay items o usuario, fuera.
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      toast("El carrito está vacío");
      navigate("/cart");
    }
    if (!authenticated) {
      toast("Debes iniciar sesión para comprar");
      navigate("/login");
    }
  }, [items, authenticated, navigate, orderSuccess]);

  // 4. Efecto al completarse la orden exitosamente
  useEffect(() => {
    if (orderSuccess) {
      toast.success("¡Orden creada con éxito!");
      dispatch(clearCart()); 
      dispatch(resetOrderState()); 
      navigate("/user"); // Redirigir a "Mis Pedidos"
    }
  }, [orderSuccess, dispatch, navigate]);

  // 5. Efecto para errores de orden
  useEffect(() => {
    if (orderError) {
      toast.error(`Error al procesar: ${orderError}`);
    }
  }, [orderError]);

  // Navegación entre pasos
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

// 6. Lógica Final: Confirmar Compra
  const handleConfirmOrder = () => {
    if (!token) {
        toast.error("Debes iniciar sesión");
        return;
    }

    // Solo mandamos datos del pago. La orden se crea sola desde el carrito.
    const paymentPayload = {
        paymentMethod: "CREDIT_CARD"
    };

    dispatch(createOrder({ paymentData: paymentPayload }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Barra de progreso */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Finalizar Compra</h1>
          <CheckoutSteps currentStep={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda: Formularios Dinámicos */}
          <div className="lg:col-span-2">
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

          {/* Columna Derecha: Resumen del Carrito */}
          <div className="hidden lg:block">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm sticky top-24 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Resumen del Pedido</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                  {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex gap-2">
                             <span className="font-medium text-gray-900 dark:text-white">x{item.quantity}</span>
                             <span className="truncate max-w-[150px]" title={item.name}>{item.name}</span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                  ))}
                </div>
                
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
                    <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2">
                        <span>Total</span>
                        <span>${(total - discount).toFixed(2)}</span>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}