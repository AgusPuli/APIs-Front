import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Ej: addItem, removeItem, clearCart
  },
});

export default cartSlice.reducer;
