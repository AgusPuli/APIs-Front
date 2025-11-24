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
  async ({ orderData, paymentData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const headers = getAuthHeaders(getState);

      // 1️⃣ PASO 1: Crear la Orden
      console.log("📡 Enviando orden...", orderData);
      
      const orderRes = await fetch(`${API_URL}/orders/checkout`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(orderData),
      });

      // ⚠️ MEJORAR MANEJO DE ERRORES
      if (!orderRes.ok) {
        let errorMsg = "Error al crear orden";
        try {
          const errorData = await orderRes.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch {
          errorMsg = await orderRes.text() || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const order = await orderRes.json();
      console.log("✅ Orden creada:", order.id);

      // 2️⃣ PASO 2: Procesar el Pago
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
        let paymentError = "Orden creada, pero falló el pago";
        try {
          const errorData = await paymentRes.json();
          paymentError = errorData.message || errorData.error || paymentError;
        } catch {
          paymentError = await paymentRes.text() || paymentError;
        }
        throw new Error(paymentError);
      }
      
      const paymentResult = await paymentRes.json();
      console.log("💳 Pago exitoso:", paymentResult);

      // 3️⃣ PASO 3: Limpiar Carrito
      dispatch(clearCart());

      return order; 

    } catch (err) {
      console.error("❌ Error en Checkout:", err);
      return rejectWithValue(err.message || "Error desconocido en checkout");
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
        state.error = action.payload || "Error en el proceso de checkout";
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;