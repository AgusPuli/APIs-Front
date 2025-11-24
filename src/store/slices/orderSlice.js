import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice"; 

const API_URL = "http://localhost:8080";

// Helper para obtener headers con el token
const getAuthHeaders = (getState) => {
  const state = getState();
  const token = state.user?.token || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// 🧠 THUNK: CHECKOUT + PAGO
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  // 1️⃣ CORRECCIÓN AQUÍ: Agregamos 'orderData' a los parámetros
  async ({ orderData, paymentData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);

      console.log("📡 Enviando orden al backend:", orderData);
      
      const orderRes = await fetch(`${API_URL}/orders/checkout`, {
        method: "POST",
        headers: headers,
        // 2️⃣ CORRECCIÓN AQUÍ: Enviamos el body con los datos
        body: JSON.stringify(orderData), 
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        throw new Error(text || "Error al crear la orden en el servidor");
      }

      const order = await orderRes.json();
      console.log("✅ Orden creada con ID:", order.id);

      // Paso 2: Procesar el Pago
      const paymentPayload = {
        orderId: order.id,
        amount: order.total, 
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
        throw new Error("Orden creada, pero falló el registro del pago.");
      }
      
      const paymentResult = await paymentRes.json();
      console.log("💳 Pago exitoso:", paymentResult);

      // Paso 3: Limpiar Carrito
      dispatch(clearCart());

      return order; 

    } catch (err) {
      console.error("❌ Error en Checkout:", err);
      return rejectWithValue(err.message);
    }
  }
);

// ... (El resto del slice se queda igual) ...
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