import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

// Helper function
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar token:', e);
    return null;
  }
}

// ============================================================
// ASYNC THUNKS (SIN TRY-CATCH)
// ============================================================

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    const { data } = await api.post('/auth/authenticate', credentials);
    
    const token = data.access_token || data.token;
    
    // Validación - Solo aquí usamos rejectWithValue para errores custom
    if (!token) {
      return rejectWithValue({ message: 'El servidor no devolvió un token' });
    }

    const decoded = parseJwt(token);
    const email = decoded?.sub || credentials.email;

    // Obtener datos del usuario
    let userData = null;
    try {
      const userResponse = await api.get(`/users/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      userData = userResponse.data;
    } catch (error) {
      console.warn("⚠ No se pudo cargar el perfil del usuario");
    }

    return { token, user: userData };
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData) => {
    const { data } = await api.put('/users/profile', userData);
    return data;
  }
);

// ============================================================
// SLICE
// ============================================================

const initialState = {
  token: null,
  user: null,
  authenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.authenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.authenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.authenticated = false;
      })
      
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError, setUser } = userSlice.actions;
export default userSlice.reducer;