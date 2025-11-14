import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Ej: setCategories, addCategory
  },
});

export default categorySlice.reducer;
