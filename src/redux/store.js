import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import cartSlice from './productSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart:cartSlice,
  },
});

export default store;
