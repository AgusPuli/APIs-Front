import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearCart } from "./cartSlice";
import api from "../../config/axiosConfig";

// ============================================================
// ASYNC THUNKS (SIN TRY-CATCH)
// ============================================================

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ orderData, paymentData }, { dispatch, rejectWithValue }) => {
    // PASO 1: Crear orden
    const { data: order } = await api.post('/orders/checkout', orderData);

    // PASO 2: Verificar si ya existe pago
    const paymentAlreadyExists = order.payment || (order.status && order.status !== "PENDING");

    if (paymentAlreadyExists) {
      console.log("ℹ️ El backend ya generó el pago automáticamente");
      dispatch(clearCart());
      return order;
    }

    // PASO 3: Crear pago manual si no existe
    const paymentPayload = {
      orderId: order.id,
      amount: order.total,
      method: paymentData.paymentMethod || "CREDIT_CARD",
      status: "COMPLETED"
    };

    // Intentar crear pago, ignorar error 409 (conflicto - ya existe)
    await api.post('/payments', paymentPayload).catch((error) => {
      if (error.status === 409) {
        console.warn("⚠️ Conflicto 409: El pago ya existía");
      } else {
        throw error; // Re-lanzar si es otro error
      }
    });

    // PASO 4: Limpiar carrito
    dispatch(clearCart());
    return order;
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async () => {
    const { data } = await api.get('/orders/user');
    return data;
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async () => {
    const { data } = await api.get('/orders');
    return data;
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }) => {
    const { data } = await api.patch(`/orders/${orderId}/status`, null, {
      params: { status }
    });
    return data;
  }
);

// ============================================================
// SLICE
// ============================================================

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
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
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
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
        state.error = action.payload?.message || action.error.message;
      })
      
      // FETCH USER ORDERS
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // FETCH ALL ORDERS
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // FETCH ORDER BY ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // UPDATE ORDER STATUS
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetOrderState, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;