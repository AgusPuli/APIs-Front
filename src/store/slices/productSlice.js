import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const { data } = await api.get('/products');
    
    // Normalizar respuesta
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
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId) => {
    const { data } = await api.get(`/products/${productId}`);
    return { 
      ...data, 
      images: Array.isArray(data.images) ? data.images : [] 
    };
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ form, imageFile }) => {
    // Crear producto
    const { data: created } = await api.post('/products', {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
    });

    // Subir imagen si existe
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      
      await api.post(`/products/${created.id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).catch((err) => {
        console.warn("⚠ La imagen no se pudo subir:", err);
      });
    }

    return created;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ form, imageFile, productId }) => {
    // Actualizar producto
    const { data: updated } = await api.put(`/products/${productId}`, {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
    });

    // Subir imagen si existe
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      
      await api.post(`/products/${productId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).catch((err) => {
        console.warn("⚠ La imagen no se pudo subir:", err);
      });
    }

    return updated;
  }
);

export const toggleProductActive = createAsyncThunk(
  "products/toggleProductActive",
  async ({ productId, active }) => {
    const { data } = await api.patch(
      `/products/${productId}/active`,
      null,
      { params: { active } }
    );
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId) => {
    await api.delete(`/products/${productId}`);
    return productId;
  }
);


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
    clearSelectedProduct: (state) => {
      state.selected = null;
      state.loadingSelected = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchProducts.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // FETCH BY ID
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
        state.error = action.error.message;
      })
      
      // CREATE
      .addCase(createProduct.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // UPDATE
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // TOGGLE ACTIVE
      .addCase(toggleProductActive.fulfilled, (state, action) => {
        const idx = state.list.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(toggleProductActive.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearProducts, clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;