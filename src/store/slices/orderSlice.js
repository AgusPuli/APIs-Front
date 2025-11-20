import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice"; 

const API_URL = "http://localhost:8080";

// Helper para obtener headers con el token
const getAuthHeaders = (getState) => {
  const state = getState();
  // Intentamos leer de Redux Y de localStorage por seguridad
  const token = state.user?.token || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// 🧠 THUNK: CHECKOUT + PAGO
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  // Recibimos orderData (el carrito) y paymentData
  async ({ orderData, paymentData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);

      // 1️⃣ PASO 1: Crear la Orden (CON BODY)
      console.log("📡 Enviando orden...", orderData);
      
      const orderRes = await fetch(`${API_URL}/orders/checkout`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData), // 👈 ¡AHORA SÍ ENVIAMOS EL CARRITO!
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        throw new Error(text || "Error backend al crear orden");
      }

      const order = await orderRes.json();
      console.log("✅ Orden creada:", order.id);

      // 2️⃣ PASO 2: Procesar el Pago
      // El backend espera un objeto específico para pagos
      const paymentPayload = {
        orderId: order.id,
        amount: order.total, // Usamos el total real que calculó el backend
        method: paymentData.paymentMethod || "CREDIT_CARD",
        status: "COMPLETED"
      };

      console.log("💸 Procesando pago...", paymentPayload);
      const paymentRes = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(paymentPayload),
      });

      if (!paymentRes.ok) {
        throw new Error("Orden creada, pero falló el pago.");
      }
      
      const paymentResult = await paymentRes.json();
      console.log("💳 Pago exitoso:", paymentResult);

      // 3️⃣ PASO 3: Limpiar Carrito
      dispatch(clearCart());

      return order; 

    } catch (err) {
      console.error("❌ Error en Checkout:", err);
      // Devolvemos el mensaje exacto para que el Toast lo muestre
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
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;