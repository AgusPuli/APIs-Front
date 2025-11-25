import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice"; 

const API_URL = "http://localhost:8080";

const getAuthHeaders = (getState) => {
  const state = getState();
  const token = state.user?.token || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ orderData, paymentData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);

      // --- PASO 1: CREAR ORDEN ---
      console.log("📡 1. Enviando orden al backend:", orderData);
      
      const orderRes = await fetch(`${API_URL}/orders/checkout`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData), 
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        throw new Error(text || "Error al crear la orden en el servidor");
      }

      const order = await orderRes.json();
      console.log("✅ Orden creada con éxito. ID:", order.id);

      // --- PASO 2: VERIFICACIÓN INTELIGENTE DE PAGO ---
      
      // Verificamos si el backend YA creó el pago automáticamente
      // (Buscamos si existe order.payment, order.paymentId o si el estado ya no es PENDING)
      const paymentAlreadyExists = order.payment || (order.status && order.status !== "PENDING");

      if (paymentAlreadyExists) {
          console.log("ℹ️ El backend ya generó el pago automáticamente. Saltando paso manual.");
          dispatch(clearCart());
          return order;
      }

      // Si no existe pago, procedemos a crearlo manualmente
      const paymentPayload = {
        orderId: order.id,
        amount: order.total, 
        method: paymentData.paymentMethod || "CREDIT_CARD",
        status: "COMPLETED" // Forzamos el estado completado si es tarjeta
      };

      console.log("💸 2. Procesando pago manual...", paymentPayload);
      
      const paymentRes = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(paymentPayload),
      });

      // --- MANEJO DE ERROR 409 (CONFLICTO) ---
      if (!paymentRes.ok) {
        // Si el error es 409, asumimos que el pago se creó milisegundos antes o por otra vía
        if (paymentRes.status === 409) {
            console.warn("⚠️ Detectado conflicto 409: El pago ya existía. Asumiendo éxito.");
            dispatch(clearCart());
            return order;
        }

        // Cualquier otro error real
        const errorText = await paymentRes.text();
        throw new Error(errorText || "Falló el registro del pago.");
      }
      
      const paymentResult = await paymentRes.json();
      console.log("💳 Pago exitoso:", paymentResult);

      // Paso 3: Limpiar Carrito tras éxito
      dispatch(clearCart());

      return order; 

    } catch (err) {
      console.error("❌ Error en Checkout:", err);
      // Retornamos el mensaje para que la UI lo muestre
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrder: null,
    loading: false,
    error: null,
    success: false, 
  },
  reducers: {
    resetOrderState: (state) => {
        state.success = false;
        state.error = null;
        state.currentOrder = null;
        state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error desconocido en el checkout";
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;