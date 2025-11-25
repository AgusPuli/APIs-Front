import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

// ============================================================
// ASYNC THUNKS (SIN TRY-CATCH)
// ============================================================

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data } = await api.get('/categories');
    return data;
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData) => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    await api.delete(`/categories/${id}`);
    return id;
  }
);

// ============================================================
// SLICE
// ============================================================

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;