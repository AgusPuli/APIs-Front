import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//
// ────────────────────────────────────────────────
//    THUNKS (arriba SIEMPRE)
// ────────────────────────────────────────────────
//

// 🧠 Obtener todos los productos
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8080/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const data = await res.json();
      const array = Array.isArray(data) ? data : data.content || [];

      // normalización
      return array.map((p) => ({
        ...p,
        category:
          typeof p.category === "object"
            ? p.category?.name || "Sin categoría"
            : p.category || "Sin categoría",
        active: typeof p.active === "boolean" ? p.active : true,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧱 Crear producto
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ form, token, imageFile }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          category: form.category,
        }),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const created = await res.json();

      // Subir imagen
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("name", form.name);

        const imgRes = await fetch(
          `http://localhost:8080/products/${created.id}/image`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          }
        );

        if (!imgRes.ok) {
          throw new Error(`Error subiendo imagen: ${imgRes.status}`);
        }
      }

      return created;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧩 Actualizar producto
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ form, token, imageFile, productId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8080/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

      // Imagen nueva
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const imgRes = await fetch(
          `http://localhost:8080/products/${productId}/image`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          }
        );

        if (!imgRes.ok) throw new Error(`Error subiendo imagen`);
      }

      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🟧 Activar / desactivar producto
export const toggleProductActive = createAsyncThunk(
  "products/toggleProductActive",
  async ({ productId, active, token }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:8080/products/${productId}/active?active=${active}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🧠 Obtener producto por ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8080/products/${productId}`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();

      return {
        ...data,
        images: Array.isArray(data.images)
          ? data.images
          : data.images
          ? [data.images]
          : [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

//
// ────────────────────────────────────────────────
//    SLICE
// ────────────────────────────────────────────────
//

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
      //
      // FETCH LISTA
      //
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      // CREATE
      //
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      // UPDATE
      //
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      // TOGGLE ACTIVE
      //
      .addCase(toggleProductActive.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleProductActive.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(toggleProductActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //
      // FETCH PRODUCT BY ID
      //
      .addCase(fetchProductById.pending, (state) => {
        state.loadingSelected = true;
        state.selected = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loadingSelected = false;
        state.selected = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.selected = null;
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
