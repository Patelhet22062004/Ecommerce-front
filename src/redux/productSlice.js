import { createSlice } from "@reduxjs/toolkit";
const initialState = {
   quantity:null
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    updateCartItem: (state, action) => {
        state.quantity = action.payload.quantity;

  }}
});

export const { setCart, updateCartItem } = cartSlice.actions;
export default cartSlice.reducer;
