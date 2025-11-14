import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import orderReducer from "./slices/orderSlice"; 
import discountReducer from "./slices/discountSlice";
import testReducer from "./slices/testSlice";

const store = configureStore({
  reducer: {
    test: testReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    discount: discountReducer,
  },
});

export default store;
