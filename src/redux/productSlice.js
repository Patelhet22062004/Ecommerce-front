import { createSlice } from "@reduxjs/toolkit";
const initialState = {
   quantity:null,
   items:null
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItem: (state, action) => {
      state.items = action.payload;
    },
    updateCartItem: (state, action) => {
        state.quantity = action.payload.quantity;

  }
}
});

export const { setItem,updateCartItem} = cartSlice.actions;
export default cartSlice.reducer;
