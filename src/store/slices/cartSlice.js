import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

// Helper
const getUserId = (getState) => {
  const state = getState();
  return state.user?.user?.id || state.user?.id;
};

// ============================================================
// ASYNC THUNKS (SIN TRY-CATCH)
// ============================================================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const { data } = await api.get('/carts/cart');
    return data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    
    if (!userId) {
      return rejectWithValue({ message: 'Usuario no autenticado' });
    }

    const { data } = await api.post('/carts/add', {
      userId,
      productId,
      quantity
    });

    return data;
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    
    if (!userId) {
      return rejectWithValue({ message: 'Usuario no autenticado' });
    }

    const state = getState();
    const currentItem = state.cart.items.find(item => 
      item.productId === productId || item.product?.id === productId
    );
    
    if (!currentItem) {
      return rejectWithValue({ message: 'Producto no encontrado en carrito' });
    }

    let data;

    if (quantity > currentItem.quantity) {
      // AUMENTAR
      const diff = quantity - currentItem.quantity;
      const response = await api.post('/carts/add', {
        userId,
        productId,
        quantity: diff
      });
      data = response.data;
    } else {
      // DISMINUIR
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
    
    if (!userId) {
      return rejectWithValue({ message: 'Usuario no autenticado' });
    }

    const { data } = await api.delete(`/carts/${userId}/item/${productId}`);
    return data;
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    
    if (!userId) {
      return rejectWithValue({ message: 'Usuario no autenticado' });
    }

    await api.delete(`/carts/${userId}/clear`).catch(() => {
      console.warn("Backend clear failed, clearing local anyway");
    });
    
    return { items: [], total: 0, discount: 0, discountCode: null };
  }
);

export const applyDiscount = createAsyncThunk(
  "cart/applyDiscount",
  async (code) => {
    const { data } = await api.post('/carts/discounts/apply', { code });
    return data;
  }
);

export const previewDiscount = createAsyncThunk(
  "cart/previewDiscount",
  async (code) => {
    const { data } = await api.post('/carts/discounts/preview', { code });
    return data;
  }
);

export const checkoutPreview = createAsyncThunk(
  "cart/checkoutPreview",
  async (_, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);
    
    if (!userId) {
      return rejectWithValue({ message: 'Usuario no autenticado' });
    }

    const { data } = await api.post(`/carts/${userId}/checkout-preview`);
    return data;
  }
);

// ============================================================
// SLICE
// ============================================================

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    discount: 0,
    discountCode: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Matcher genérico para actualizar estado
    builder.addMatcher(
      (action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.items !== undefined) {
          state.items = action.payload.items;
          state.total = action.payload.total || 0;
          state.discount = action.payload.discount || 0;
          state.discountCode = action.payload.discountCode || null;
        }
      }
    );

    builder.addMatcher(
      (action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      }
    );
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;