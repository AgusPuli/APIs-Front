// src/store/slices/discountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//
// ────────────────────────────────────────────────
//    CONFIG
// ────────────────────────────────────────────────
//
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

const authHeaders = (token) => {
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

//
// ────────────────────────────────────────────────
//    THUNKS
// ────────────────────────────────────────────────
//

// 🔹 Obtener todos los descuentos
export const fetchDiscounts = createAsyncThunk(
    "discounts/fetchDiscounts",
    async (token, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/admin/discounts`, {
                method: "GET",
                headers: {
                    ...authHeaders(token),
                },
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `Error HTTP ${res.status}`);
            }

            const data = await res.json();

            // backend a veces devuelve array, a veces paginado
            return Array.isArray(data) ? data : data.content || [];

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🔹 Crear descuento
export const createDiscount = createAsyncThunk(
    "discounts/createDiscount",
    async ({ form, token }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/admin/discounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(token),
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Error HTTP ${res.status}`);
            }

            return await res.json();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🔹 Actualizar descuento
export const updateDiscount = createAsyncThunk(
    "discounts/updateDiscount",
    async ({ form, token, discountId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/admin/discounts/${discountId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(token),
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Error HTTP ${res.status}`);
            }

            return await res.json();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🔹 Eliminar descuento
export const deleteDiscount = createAsyncThunk(
    "discounts/deleteDiscount",
    async ({ discountId, token }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/admin/discounts/${discountId}`, {
                method: "DELETE",
                headers: {
                    ...authHeaders(token),
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Error HTTP ${res.status}`);
            }

            return discountId;

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🔹 Obtener descuento por ID
export const fetchDiscountById = createAsyncThunk(
    "discounts/fetchDiscountById",
    async ({ discountId, token }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/admin/discounts/${discountId}`, {
                method: "GET",
                headers: {
                    ...authHeaders(token),
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Error HTTP ${res.status}`);
            }

            return await res.json();

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
            // 📌 Fetch all
            .addCase(fetchDiscounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDiscounts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchDiscounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 📌 Create
            .addCase(createDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 📌 Update
            .addCase(updateDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex((d) => d.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(updateDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 📌 Delete
            .addCase(deleteDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((d) => d.id !== action.payload);
            })
            .addCase(deleteDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 📌 Fetch by ID
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
                state.error = action.payload;
            });
    },
});

export const {
    clearDiscounts,
    setActiveDiscount,
    clearActiveDiscount,
} = discountSlice.actions;

export default discountSlice.reducer;
