import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:8080";

// Helper para obtener headers con token
const getAuthHeaders = (getState) => {
  const state = getState();
  const token = state.user?.token || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// 📥 FETCH: Obtener carrito del backend (GET /carts/cart)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const res = await fetch(`${API_URL}/carts/cart`, {
        method: "GET",
        headers: headers,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Error al obtener carrito");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ➕ CREATE/ADD: Agregar producto al carrito (POST /carts/add)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const res = await fetch(`${API_URL}/carts/add`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Error al agregar producto");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✏️ UPDATE: Actualizar cantidad - DECREASE (PUT /carts/{userId}/item/{productId}/decrease)
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const state = getState();
      const userId = state.user?.user?.id;

      if (!userId) {
        throw new Error("Usuario no autenticado");
      }

      // Si la cantidad aumenta, usamos addToCart
      // Si disminuye, usamos el endpoint decrease
      const currentItem = state.cart.items.find(item => item.id === productId);
      
      if (!currentItem) {
        throw new Error("Producto no encontrado en el carrito");
      }

      if (quantity > currentItem.quantity) {
        // Aumentar: usar addToCart con la diferencia
        const diff = quantity - currentItem.quantity;
        const res = await fetch(`${API_URL}/carts/add`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ productId, quantity: diff }),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Error al actualizar cantidad");
        }

        return await res.json();
      } else {
        // Disminuir: usar decrease endpoint
        const res = await fetch(`${API_URL}/carts/${userId}/item/${productId}/decrease`, {
          method: "PUT",
          headers: headers,
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Error al actualizar cantidad");
        }

        return await res.json();
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🗑️ DELETE: Eliminar producto del carrito (DELETE /carts/{userId}/item/{productId})
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const state = getState();
      const userId = state.user?.user?.id;

      if (!userId) {
        throw new Error("Usuario no autenticado");
      }

      const res = await fetch(`${API_URL}/carts/${userId}/item/${productId}`, {
        method: "DELETE",
        headers: headers,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Error al eliminar producto");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧹 CLEAR: Vaciar todo el carrito (DELETE /carts/{userId}/clear)
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const state = getState();
      const userId = state.user?.user?.id;

      if (!userId) {
        throw new Error("Usuario no autenticado");
      }

      const res = await fetch(`${API_URL}/carts/${userId}/clear`, {
        method: "DELETE",
        headers: headers,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Error al vaciar carrito");
      }

      return { items: [], total: 0, discount: 0, discountCode: null };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🎟️ DISCOUNT: Aplicar código de descuento (POST /cart/discounts/apply)
export const applyDiscount = createAsyncThunk(
  "cart/applyDiscount",
  async (code, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const res = await fetch(`${API_URL}/cart/discounts/apply`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Código inválido");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔍 PREVIEW: Vista previa del descuento (POST /cart/discounts/preview)
export const previewDiscount = createAsyncThunk(
  "cart/previewDiscount",
  async (code, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const res = await fetch(`${API_URL}/cart/discounts/preview`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Código inválido");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🛒 CHECKOUT PREVIEW: Vista previa del checkout (POST /carts/{userId}/checkout-preview)
export const checkoutPreview = createAsyncThunk(
  "cart/checkoutPreview",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const state = getState();
      const userId = state.user?.user?.id;

      if (!userId) {
        throw new Error("Usuario no autenticado");
      }

      const res = await fetch(`${API_URL}/carts/${userId}/checkout-preview`, {
        method: "POST",
        headers: headers,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Error al obtener preview");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
    builder
      // 📥 FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.discount = action.payload.discount || 0;
        state.discountCode = action.payload.discountCode || null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ UPDATE QUANTITY
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ REMOVE FROM CART
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🧹 CLEAR CART
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.discount = 0;
        state.discountCode = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🎟️ APPLY DISCOUNT
      .addCase(applyDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discount = action.payload.discount;
        state.discountCode = action.payload.discountCode;
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔍 PREVIEW DISCOUNT
      .addCase(previewDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(previewDiscount.fulfilled, (state, action) => {
        state.loading = false;
        // Preview no modifica el estado, solo retorna data
      })
      .addCase(previewDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🛒 CHECKOUT PREVIEW
      .addCase(checkoutPreview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutPreview.fulfilled, (state, action) => {
        state.loading = false;
        // Preview data disponible en action.payload
      })
      .addCase(checkoutPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;