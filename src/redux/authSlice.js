import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userid: localStorage.getItem("userid") || null,
    refresh: localStorage.getItem("refresh_token") || null,
    token: localStorage.getItem("access_token") || null,
    IsAuthenticated: !!localStorage.getItem("access_token")
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userid = action.payload.userid;
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.IsAuthenticated = true;
      localStorage.setItem("IsAuthenticated", true)
      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("refresh_token", action.payload.refresh);
      localStorage.setItem("userid", action.payload.userid);
    },
    logout: (state) => {
      state.userid = null;
      state.token = null;
      state.refresh = null;
      state.IsAuthenticated = false;
     localStorage.removeItem("IsAuthenticated")
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userid");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
