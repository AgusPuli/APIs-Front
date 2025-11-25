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

// GET /carts/cart (del CartsController con Authentication)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const { data } = await api.get("/carts/cart");
    return data;
  }
);

// POST /carts/add (del CartsController)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);

    if (!userId) {
      return rejectWithValue({ message: "Usuario no autenticado" });
    }

    const { data } = await api.post("/carts/add", {
      userId,
      productId,
      quantity,
    });

    return data;
  }
);

// PUT /carts/update-item o PUT /carts/{userId}/item/{productId}/decrease
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);

    if (!userId) {
      return rejectWithValue({ message: "Usuario no autenticado" });
    }

    const state = getState();
    const currentItem = state.cart.items.find(
      (item) => item.productId === productId || item.product?.id === productId
    );

    if (!currentItem) {
      return rejectWithValue({ message: "Producto no encontrado en carrito" });
    }

    let data;

    if (quantity > currentItem.quantity) {
      // AUMENTAR
      const diff = quantity - currentItem.quantity;
      const response = await api.post("/carts/add", {
        userId,
        productId,
        quantity: diff,
      });
      data = response.data;
    } else {
      // DISMINUIR (en tu backend esto probablemente decrementa en 1)
      const response = await api.put(
        `/carts/${userId}/item/${productId}/decrease`
      );
      data = response.data;
    }

    return data;
  }
);

// DELETE /carts/{userId}/item/{productId}
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);

    if (!userId) {
      return rejectWithValue({ message: "Usuario no autenticado" });
    }

    const { data } = await api.delete(`/carts/${userId}/item/${productId}`);
    return data;
  }
);

// DELETE /carts/{userId}/clear
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);

    if (!userId) {
      return rejectWithValue({ message: "Usuario no autenticado" });
    }

    await api.delete(`/carts/${userId}/clear`).catch(() => {
      console.warn("Backend clear failed, clearing local anyway");
    });

    // Devolvemos un carrito vacío alineado con el matcher genérico
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

// POST /cart/discounts/apply (del CartDiscountsController)
export const applyDiscount = createAsyncThunk(
  "cart/applyDiscount",
  async (code, { rejectWithValue }) => {
    try {
      // 1) Aplico el cupón en el backend
      await api.post("/cart/discounts/apply", { code });

      // 2) Vuelvo a pedir el carrito ya actualizado
      const { data } = await api.get("/carts/cart"); // trae: items, subtotal, total, discountAmount, discountCode, discountPercentage
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// POST /cart/discounts/preview (del CartDiscountsController)
export const previewDiscount = createAsyncThunk(
  "cart/previewDiscount",
  async (code) => {
    const { data } = await api.post("/cart/discounts/preview", { code });
    return data; // DiscountPreviewResponse
  }
);

// DELETE /cart/discounts (remover descuento)
export const removeDiscount = createAsyncThunk(
  "cart/removeDiscount",
  async () => {
    await api.delete("/cart/discounts");
    // Retornar carrito actualizado sin descuento
    const { data } = await api.get("/carts/cart");
    return data;
  }
);

// POST /carts/{userId}/checkout-preview
export const checkoutPreview = createAsyncThunk(
  "cart/checkoutPreview",
  async (_, { getState, rejectWithValue }) => {
    const userId = getUserId(getState);

    if (!userId) {
      return rejectWithValue({ message: "Usuario no autenticado" });
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
    total: 0, // total con descuento
    subtotal: 0, // total sin descuento
    discount: 0, // monto de descuento que usamos en el front
    discountCode: null,
    discountPercentage: 0,
    loading: false,
    error: null,
    preview: null, // 🔹 para la vista previa del cupón
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // 🔹 guarda la respuesta de preview
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
    // 🔹 limpia la preview (al aplicar o quitar cupón)
    clearPreview: (state) => {
      state.preview = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ Matcher genérico para TODOS los fulfilled del carrito
    builder.addMatcher(
      (action) =>
        action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.items !== undefined) {
          state.items = action.payload.items;

          // total YA VIENE CON EL DESCUENTO APLICADO (900)
          state.total = action.payload.total ?? 0;

          // el backend manda discountAmount, no "discount"
          const discountFromPayload =
            action.payload.discountAmount ?? action.payload.discount ?? 0;

          state.discount = discountFromPayload;

          // guardamos subtotal si viene (1000)
          state.subtotal =
            action.payload.subtotal ?? state.total + discountFromPayload;

          state.discountCode = action.payload.discountCode || null;
          state.discountPercentage =
            action.payload.discountPercentage ?? 0;
        }
      }
    );

    builder.addMatcher(
      (action) =>
        action.type.startsWith("cart/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) =>
        action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      }
    );
  },
});

export const { clearError, setPreview, clearPreview } = cartSlice.actions;
export default cartSlice.reducer;