import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart");
const initialState = storedCart 
  ? JSON.parse(storedCart) 
  : { items: [], total: 0, discount: 0, discountCode: null }; 

const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const saveToStorage = (state) => {
    localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.stock = product.stock;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      
      state.total = calculateTotal(state.items);
      saveToStorage(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      state.total = calculateTotal(state.items);
      saveToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);
        saveToStorage(state);
      }
    },
    applyDiscount: (state, action) => {
        const { code, amount } = action.payload;
        state.discountCode = code;
        state.discount = amount;
        saveToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.discount = 0;
      state.discountCode = null;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, applyDiscount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;