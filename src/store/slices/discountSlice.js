import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  activeDiscount: null,
  loading: false,
  error: null,
};

const discountSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    // Ej: setDiscounts, applyDiscount, clearDiscount
  },
});

export default discountSlice.reducer;
