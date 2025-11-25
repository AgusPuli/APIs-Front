import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

// ============================================================
// ASYNC THUNKS (SIN TRY-CATCH)
// ============================================================

export const fetchDiscounts = createAsyncThunk(
  "discounts/fetchDiscounts",
  async () => {
    const { data } = await api.get('/admin/discounts');
    return Array.isArray(data) ? data : data.content || [];
  }
);

export const createDiscount = createAsyncThunk(
  "discounts/createDiscount",
  async (form) => {
    const { data } = await api.post('/admin/discounts', form);
    return data;
  }
);

export const updateDiscount = createAsyncThunk(
  "discounts/updateDiscount",
  async ({ form, discountId }) => {
    const { data } = await api.put(`/admin/discounts/${discountId}`, form);
    return data;
  }
);

export const deleteDiscount = createAsyncThunk(
  "discounts/deleteDiscount",
  async (discountId) => {
    await api.delete(`/admin/discounts/${discountId}`);
    return discountId;
  }
);

export const fetchDiscountById = createAsyncThunk(
  "discounts/fetchDiscountById",
  async (discountId) => {
    const { data } = await api.get(`/admin/discounts/${discountId}`);
    return data;
  }
);

// ============================================================
// SLICE
// ============================================================

const discountSlice = createSlice({
  name: "discounts",
  initialState: {
    list: [],
    loading: false,
    error: null,
    selected: null,
    loadingSelected: false,
    activeDiscount: null,
  },
  reducers: {
    clearDiscounts: (state) => {
      state.list = [];
      state.error = null;
    },
    setActiveDiscount: (state, action) => {
      state.activeDiscount = action.payload;
    },
    clearActiveDiscount: (state) => {
      state.activeDiscount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // CREATE
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // UPDATE
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(d => d.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // DELETE
      .addCase(deleteDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // FETCH BY ID
      .addCase(fetchDiscountById.pending, (state) => {
        state.loadingSelected = true;
        state.selected = null;
      })
      .addCase(fetchDiscountById.fulfilled, (state, action) => {
        state.loadingSelected = false;
        state.selected = action.payload;
      })
      .addCase(fetchDiscountById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.selected = null;
        state.error = action.error.message;
      });
  },
});

export const {
  clearDiscounts,
  setActiveDiscount,
  clearActiveDiscount,
} = discountSlice.actions;

export default discountSlice.reducer;