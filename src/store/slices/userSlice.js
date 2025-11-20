import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:8080";

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("📡 Enviando credenciales...");
      const res = await fetch(`${API_URL}/auth/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");
      
      const data = await res.json();
      const token = data.access_token || data.token;
      
      if (!token) throw new Error("El servidor no devolvió un token");

      // Decodificamos el token para sacar el email (subject)
      const decoded = parseJwt(token);
      const email = decoded ? decoded.sub : credentials.email; // Fallback al email del form

      console.log("📡 Obteniendo perfil para:", email);
      const userRes = await fetch(`${API_URL}/users/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` } // 👈 Usamos el token recién llegado
      });

      let userData = null;
      if (userRes.ok) {
        userData = await userRes.json();
      } else {
        console.warn("⚠ No se pudo cargar el perfil del usuario");
      }

      // GUARDAR TODO EN STORAGE
      localStorage.setItem("token", token);
      if (userData) localStorage.setItem("user", JSON.stringify(userData));
      
      return { token, user: userData };

    } catch (err) {
      console.error("❌ Error Login:", err);
      return rejectWithValue(err.message);
    }
  }
);

// ESTADO INICIAL
const token = localStorage.getItem("token");
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
  token: token || null,
  user: user || null,
  authenticated: !!token,
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
      localStorage.clear();
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;