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

// Helper para obtener User ID de forma robusta
const getUserId = (getState) => {
    const state = getState();
    // Intentar varias rutas posibles en el estado
    let userId = state.user?.user?.id || state.user?.id;

    // Fallback: Leer del localStorage si Redux falló o se recargó la página
    if (!userId) {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                userId = parsed.id;
            }
        } catch (e) {
            console.error("Error parsing user from storage", e);
        }
    }
    return userId;
};

// Helper para manejar respuestas
const handleResponse = async (res) => {
    if (!res.ok) {
        const text = await res.text();
        let message = text;
        try {
             const json = JSON.parse(text);
             message = json.message || text;
        } catch {}
        throw new Error(message || `Error HTTP ${res.status}`);
    }
    return res.json();
};

// 📥 FETCH: Obtener carrito del backend
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const res = await fetch(`${API_URL}/carts/cart`, {
        method: "GET",
        headers: headers,
      });
      return await handleResponse(res);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ➕ CREATE/ADD: Agregar producto al carrito
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const userId = getUserId(getState);

      if (!userId) throw new Error("Usuario no autenticado");

      // Body plano: { userId, productId, quantity }
      // Esto debe coincidir con tu CartAddRequest en Java
      const body = JSON.stringify({ 
          userId: userId, 
          productId: productId, 
          quantity: quantity 
      });

      const res = await fetch(`${API_URL}/carts/add`, {
        method: "POST",
        headers: headers,
        body: body
      });

      return await handleResponse(res);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

//  UPDATE: Actualizar cantidad (Inteligente: Add o Decrease)
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const userId = getUserId(getState);

      if (!userId) throw new Error("Usuario no autenticado");

      const state = getState();
      
      // 🛑 CORRECCIÓN DE BÚSQUEDA:
      // Buscamos comparando el ID del producto, no el del renglón.
      const currentItem = state.cart.items.find(item => 
          item.productId === productId || item.product?.id === productId
      );
      
      if (!currentItem) throw new Error("Producto no encontrado en carrito local");

      let res;

      if (quantity > currentItem.quantity) {
        // AUMENTAR: Calculamos diferencia
        const diff = quantity - currentItem.quantity;
        res = await fetch(`${API_URL}/carts/add`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ userId, productId, quantity: diff }),
        });
      } else {
        // DISMINUIR
        res = await fetch(`${API_URL}/carts/${userId}/item/${productId}/decrease`, {
          method: "PUT",
          headers: headers,
        });
      }

      if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error al actualizar");
      }
      return await res.json();

    } catch (err) {
      console.error("❌ Error updateQuantity:", err);
      return rejectWithValue(err.message);
    }
  }
);

// 🗑️ DELETE: Eliminar producto
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const userId = getUserId(getState);

      if (!userId) throw new Error("Usuario no autenticado");

      const res = await fetch(`${API_URL}/carts/${userId}/item/${productId}`, {
        method: "DELETE",
        headers: headers,
      });

      return await handleResponse(res);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧹 CLEAR: Vaciar carrito
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const userId = getUserId(getState);

      if (!userId) throw new Error("Usuario no autenticado");

      const res = await fetch(`${API_URL}/carts/${userId}/clear`, {
        method: "DELETE",
        headers: headers,
      });

      if (!res.ok) {
          // Si falla el clear del backend, al menos limpiamos el front
          console.warn("Backend clear failed, clearing local anyway");
      }

      return { items: [], total: 0, discount: 0, discountCode: null };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🎟️ DISCOUNT & PREVIEW (Sin cambios mayores)
export const applyDiscount = createAsyncThunk(
  "cart/applyDiscount",
  async (code, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const res = await fetch(`${API_URL}/carts/discounts/apply`, { // Ajusté ruta a /carts/ si es consistente
        method: "POST",
        headers: headers,
        body: JSON.stringify({ code }),
      });
      return await handleResponse(res);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const previewDiscount = createAsyncThunk(
  "cart/previewDiscount",
  async (code, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const res = await fetch(`${API_URL}/carts/discounts/preview`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ code }),
      });
      return await handleResponse(res);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const checkoutPreview = createAsyncThunk(
  "cart/checkoutPreview",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      const userId = getUserId(getState);
      if (!userId) throw new Error("Usuario no autenticado");

      const res = await fetch(`${API_URL}/carts/${userId}/checkout-preview`, {
        method: "POST",
        headers: headers,
      });
      return await handleResponse(res);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// SLICE
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
    // Matcher genérico para actualizar estado con la respuesta del carrito
    // Esto evita repetir código en cada fulfilled
    builder.addMatcher(
      (action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.loading = false;
        // Si la respuesta trae estructura de carrito, actualizamos todo
        if (action.payload && action.payload.items) {
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
        state.error = action.payload;
      }
    );
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;