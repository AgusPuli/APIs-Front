import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  authenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Ej: setUser, setToken, logout
  },
});

export default userSlice.reducer;
