import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

// Helper
const getUserId = (getState) => {
  const state = getState();
  return state.user?.user?.id || state.user?.id;
};

// ============================================================
// ASYNC THUNKS
// ============================================================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const { data } = await api.get("/carts/cart");
    return data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    if (!userId) return rejectWithValue({ message: "Usuario no autenticado" });

    const { data } = await api.post("/carts/add", { userId, productId, quantity });
    return data;
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    if (!userId) return rejectWithValue({ message: "Usuario no autenticado" });

    const state = getState();
    const currentItem = state.cart.items.find(
      (item) => item.productId === productId || item.product?.id === productId
    );

    if (!currentItem) {
      return rejectWithValue({ message: "Producto no encontrado en carrito" });
    }

    let data;
    if (quantity > currentItem.quantity) {
      const diff = quantity - currentItem.quantity;
      const response = await api.post("/carts/add", { userId, productId, quantity: diff });
      data = response.data;
    } else {
      const response = await api.put(`/carts/${userId}/item/${productId}/decrease`);
      data = response.data;
    }
    return data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    if (!userId) return rejectWithValue({ message: "Usuario no autenticado" });

    const { data } = await api.delete(`/carts/${userId}/item/${productId}`);
    return data;
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    if (!userId) return rejectWithValue({ message: "Usuario no autenticado" });

    await api.delete(`/carts/${userId}/clear`).catch(() => {
      console.warn("Backend clear failed, clearing local anyway");
    });

    return {
      items: [],
      total: 0,
      subtotal: 0,
      discount: 0,
      discountAmount: 0,
      discountCode: null,
      discountPercentage: 0,
    };
  }
);

export const applyDiscount = createAsyncThunk(
  "cart/applyDiscount",
  async (code, { rejectWithValue }) => {
    try {
      await api.post("/cart/discounts/apply", { code });
      const { data } = await api.get("/carts/cart");
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const previewDiscount = createAsyncThunk(
  "cart/previewDiscount",
  async (code) => {
    const { data } = await api.post("/cart/discounts/preview", { code });
    return data;
  }
);

export const removeDiscount = createAsyncThunk(
  "cart/removeDiscount",
  async () => {
    await api.delete("/cart/discounts");
    const { data } = await api.get("/carts/cart");
    return data;
  }
);

export const checkoutPreview = createAsyncThunk(
  "cart/checkoutPreview",
  async (_, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    if (!userId) return rejectWithValue({ message: "Usuario no autenticado" });

    const { data } = await api.post(`/carts/${userId}/checkout-preview`);
    return data;
  }
);

// ============================================================
// HELPER: Actualizar carrito desde payload
// ============================================================
const updateCartFromPayload = (state, payload) => {
  state.items = payload.items;
  state.total = payload.total ?? 0;
  
  const discountFromPayload = payload.discountAmount ?? payload.discount ?? 0;
  state.discount = discountFromPayload;
  state.subtotal = payload.subtotal ?? state.total + discountFromPayload;
  state.discountCode = payload.discountCode || null;
  state.discountPercentage = payload.discountPercentage ?? 0;
};

// ============================================================
// SLICE
// ============================================================
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    subtotal: 0,
    discount: 0,
    discountCode: null,
    discountPercentage: 0,
    loading: false,
    error: null,
    preview: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
    clearPreview: (state) => {
      state.preview = null;
    },
  },
  extraReducers: (builder) => {
    // ============================================================
    // CASOS ESPECÍFICOS - Solo actualizan cuando es necesario
    // ============================================================
    
    // FETCH CART
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items !== undefined) {
          updateCartFromPayload(state, action.payload);
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

    // ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items !== undefined) {
          updateCartFromPayload(state, action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

    // UPDATE QUANTITY
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items !== undefined) {
          updateCartFromPayload(state, action.payload);
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

    // REMOVE FROM CART
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items !== undefined) {
          updateCartFromPayload(state, action.payload);
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

    // CLEAR CART
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        updateCartFromPayload(state, action.payload);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

    // APPLY DISCOUNT
      .addCase(applyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.preview = null; // Limpiar preview al aplicar
        if (action.payload?.items !== undefined) {
          updateCartFromPayload(state, action.payload);
        }
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

    // REMOVE DISCOUNT
      .addCase(removeDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDiscount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items !== undefined) {
          updateCartFromPayload(state, action.payload);
        }
      })
      .addCase(removeDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

    // ============================================================
    // PREVIEW DISCOUNT - NO actualiza carrito, solo preview
    // ============================================================
      .addCase(previewDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(previewDiscount.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Solo guarda preview, NO actualiza items
        state.preview = action.payload;
      })
      .addCase(previewDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.preview = null;
      })

    // ============================================================
    // CHECKOUT PREVIEW - NO actualiza nada
    // ============================================================
      .addCase(checkoutPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutPreview.fulfilled, (state) => {
        state.loading = false;
        // ✅ No actualiza nada, solo para validación
      })
      .addCase(checkoutPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearError, setPreview, clearPreview } = cartSlice.actions;
export default cartSlice.reducer;