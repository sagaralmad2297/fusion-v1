// import { configureStore } from "@reduxjs/toolkit"
// import authReducer from "./slices/authSlice"
// import cartReducer from "./slices/cartSlice"
// import wishlistReducer from "./slices/wishlistSlice"
// import productReducer from "./slices/productSlice"
// import orderReducer from "./slices/orderSlice"

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     cart: cartReducer,
//     wishlist: wishlistReducer,
//     products: productReducer,
//     orders: orderReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// })

// src/store/store.js


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import addressReducer from './slices/addressSlice';
import axiosInstance, { setupInterceptors } from "../utils/api"; // Import axiosInstance and setupInterceptors

// Create the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Set up Axios interceptors with the store
setupInterceptors(store);

export default store;