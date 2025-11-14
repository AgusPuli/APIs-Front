import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Ej: setOrders, addOrder, updateOrderStatus
  },
});

export default orderSlice.reducer;
