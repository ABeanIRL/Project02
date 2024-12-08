import { createSlice } from "@reduxjs/toolkit";

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    userInfo: JSON.parse(localStorage.getItem("customerUser")),
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("customerUser");
      state.loading = false;
      state.userInfo = null;
      state.error = null;
    },
    setCredentials: (state, action) => {
      localStorage.setItem("customerUser", JSON.stringify(action.payload));
      state.userInfo = action.payload;
    },
  },
});

export const { logout, setCredentials } = customerSlice.actions;

export default customerSlice.reducer;
