import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";


export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ userId, items, shippingData, paymentData }) => {
    // Preparar el payload según el formato que espera CheckoutRequest
    const checkoutPayload = {
      items: items.map((item) => {
        const price = item.price || item.unitPrice || 0;
        return {
          productId: item.product?.id || item.productId,
          quantity: item.quantity,
          price: price,
        };
      }),
      total: items.reduce((sum, item) => {
        const price = item.price || item.unitPrice || 0;
        const quantity = item.quantity || 0;
        return sum + (Number(price) * Number(quantity));
      }, 0),
      shippingAddress: shippingData.address,
      shippingCity: shippingData.city,
      shippingPostalCode: shippingData.postalCode,
      shippingProvince: shippingData.province || "",
      shippingCountry: shippingData.country || "Argentina",
      paymentMethod: paymentData.paymentMethod || "CREDIT_CARD",
    };

    console.log("📦 Checkout payload:", checkoutPayload);

    const { data: order } = await api.post("/orders/checkout", checkoutPayload);

    console.log("✅ Order created:", order);
    return order;
  }
);

// Obtener órdenes del usuario actual
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { getState }) => {
    const userId = getState().user?.user?.id;
    
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const { data } = await api.get(`/orders/by-user/${userId}`);
    return Array.isArray(data) ? data : data.content || [];
  }
);

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

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }) => {
    const { data } = await api.put(`/orders/${orderId}/status?status=${status}`);
    return data;
  }
);


const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    selectedOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOrderState: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
        state.selectedOrder = action.payload;
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
        // Actualizar en la lista
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Actualizar selectedOrder si es la misma
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;