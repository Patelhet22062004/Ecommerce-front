import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userid: localStorage.getItem("userid")||null,
    refresh: localStorage.getItem("refresh_token") || null,
    token: localStorage.getItem("access_token") || null,
    IsAuthenticated:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userid = action.payload.userid;
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.IsAuthenticated=true;
            localStorage.setItem("access_token", action.payload.token);
            localStorage.setItem("refresh_token", action.payload.refresh);
            localStorage.setItem("userid",action.payload.userid);
        },
        logout: (state) => {
      state.userid = null;
      state.token = null;
      state.IsAuthenticated=false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("userid");
    },
    Delete:(state)=>{
        state.userid = null;
        state.token = null;
        // state.IsAuthenticated=false;
        localStorage.removeItem("access_token");
        localStorage.removeItem("userid");
        loginStorage.removeItem('refresh_token')
      }
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
