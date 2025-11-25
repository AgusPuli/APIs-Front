import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

// ============================================================
// THUNKS (Acciones asíncronas)
// ============================================================

// Crear una orden
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, items, shippingData, paymentData }, { dispatch, rejectWithValue }) => {
    const orderPayload = {
      userId,
      items: items.map((item) => ({
        productId: item.product?.id || item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      shippingAddress: shippingData.address,
      shippingCity: shippingData.city,
      shippingPostalCode: shippingData.postalCode,
    };

    const { data: order } = await api.post("/orders", orderPayload);

    // Verificar si ya existe un pago
    if (order.payment || order.payments?.length > 0) {
      console.log("ℹ️ El backend ya generó el pago automáticamente");
      return order;
    }

    // Si no existe pago, crearlo manualmente
    const paymentPayload = {
      orderId: order.id,
      amount: order.total,
      method: paymentData.paymentMethod || "CREDIT_CARD",
      status: "COMPLETED",
    };

    try {
      await api.post("/payments", paymentPayload);
      console.log("✅ Pago registrado correctamente");
    } catch (err) {
      if (err.status === 409 || err.message?.includes("409")) {
        console.log("⚠️ El pago ya existe (409), continuando...");
      } else {
        throw err;
      }
    }

    return order;
  }
);

// Obtener órdenes del usuario actual
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { getState }) => {
    // ✅ Obtener userId del estado de Redux
    const userId = getState().user?.user?.id;
    
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const { data } = await api.get(`/orders/by-user/${userId}`);
    return Array.isArray(data) ? data : data.content || [];
  }
);

// Obtener todas las órdenes (Admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async () => {
    const { data } = await api.get('/orders');
    return Array.isArray(data) ? data : data.content || [];
  }
);

// Obtener orden por ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  }
);

// Actualizar estado de la orden (Admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }) => {
    const { data } = await api.put(`/orders/${orderId}/status`, { status });
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
        state.list.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.success = false;
      })

      // FETCH USER ORDERS
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // FETCH ALL ORDERS (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.error = null;
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
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar orden en la lista
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Actualizar orden actual si coincide
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetOrderState, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;