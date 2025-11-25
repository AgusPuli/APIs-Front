import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Importar reducers desde slices/
import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import discountReducer from './slices/discountSlice';
import orderReducer from './slices/orderSlice';
import testReducer from './slices/testSlice';

// Configuración de redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'cart'],
  blacklist: ['products', 'categories', 'discounts', 'orders', 'test'],
};

// Combinar reducers
const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
  categories: categoryReducer,
  discounts: discountReducer,
  orders: orderReducer,
  test: testReducer,
});

// Crear el reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurar store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;