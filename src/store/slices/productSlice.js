import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:8080";

// 🛠️ Helper para obtener headers con Token automáticamente
const getAuthHeaders = (getState) => {
  const state = getState();
  const token = state.user?.token || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// 🛠️ Helper para headers de imagen (sin Content-Type json)
const getImageHeaders = (getState) => {
  const state = getState();
  const token = state.user?.token || localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// ============================================================
// THUNKS
// ============================================================

// 🧠 1. FETCH ALL
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const headers = getAuthHeaders(getState);
      // Quitamos Content-Type para GET, pero mantenemos Auth
      const res = await fetch(`${API_URL}/products`, { 
          headers: { Authorization: headers.Authorization } 
      });
      
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();
      
      let array = [];
      if (Array.isArray(data)) array = data;
      else if (data.content) array = data.content;
      else if (data.products) array = data.products;

      return array.map((p) => ({
        ...p,
        id: p.id,
        name: p.name || "",
        description: p.description || "",
        price: typeof p.price === "number" ? p.price : 0,
        stock: typeof p.stock === "number" ? p.stock : 0,
        category: p.category?.name || (typeof p.category === "string" ? p.category : "Sin categoría"),
        active: p.active !== undefined ? p.active : true,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧠 2. CREATE PRODUCT (Ahora lee el token solo)
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ form, imageFile }, { rejectWithValue, getState }) => {
    try {
      console.log("📤 Creando producto...", form);

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: getAuthHeaders(getState), // 👈 Token automático
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          category: form.category, // Asegúrate que tu backend acepte String ("ELECTRONICS") o Enum
        }),
      });

      if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Error ${res.status}`);
      }
      
      const created = await res.json();
      console.log("✅ Producto creado, ID:", created.id);

      // Subir imagen si existe
      if (imageFile) {
        console.log("📤 Subiendo imagen...");
        const formData = new FormData();
        formData.append("file", imageFile);
        
        const imgRes = await fetch(`${API_URL}/products/${created.id}/image`, {
            method: "POST",
            headers: getImageHeaders(getState), // 👈 Token automático
            body: formData,
        });
        
        if(!imgRes.ok) console.warn("⚠ La imagen no se pudo subir");
      }

      return created;
    } catch (err) {
      console.error("❌ Error createProduct:", err);
      return rejectWithValue(err.message);
    }
  }
);

// 🧠 3. UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ form, imageFile, productId }, { rejectWithValue, getState }) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: getAuthHeaders(getState), // 👈 Token automático
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const updated = await res.json();

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await fetch(`${API_URL}/products/${productId}/image`, {
            method: "POST",
            headers: getImageHeaders(getState),
            body: formData,
        });
      }

      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧠 4. TOGGLE ACTIVE
export const toggleProductActive = createAsyncThunk(
  "products/toggleProductActive",
  async ({ productId, active }, { rejectWithValue, getState }) => {
    try {
      const res = await fetch(
        `${API_URL}/products/${productId}/active?active=${active}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(getState), // 👈 Token automático
        }
      );

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧠 5. DELETE PRODUCT (Si lo necesitas)
export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (productId, { rejectWithValue, getState }) => {
        try {
            const res = await fetch(`${API_URL}/products/${productId}`, {
                method: "DELETE",
                headers: getAuthHeaders(getState),
            });
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            return productId;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🧠 6. FETCH BY ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();
      return { ...data, images: Array.isArray(data.images) ? data.images : [] };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ============================================================
// SLICE
// ============================================================

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
    selected: null,
    loadingSelected: false,
  },
  reducers: {
    clearProducts: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // CREATE
      .addCase(createProduct.pending, (state) => { state.loading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE & TOGGLE
      .addCase(updateProduct.fulfilled, (state, action) => {
          state.loading = false;
          const idx = state.list.findIndex(p => p.id === action.payload.id);
          if(idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(toggleProductActive.fulfilled, (state, action) => {
          const idx = state.list.findIndex(p => p.id === action.payload.id);
          if(idx !== -1) state.list[idx] = action.payload;
      })
      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
          state.list = state.list.filter(p => p.id !== action.payload);
      })
      // FETCH ID
      .addCase(fetchProductById.pending, (state) => {
          state.loadingSelected = true;
          state.selected = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
          state.loadingSelected = false;
          state.selected = action.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;