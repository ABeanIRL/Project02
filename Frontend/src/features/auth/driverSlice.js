import { createSlice } from "@reduxjs/toolkit";

export const driverSlice = createSlice({
  name: "driver",
  initialState: {
    userInfo: JSON.parse(localStorage.getItem("driverUser")),
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("driverUser");
      state.loading = false;
      state.userInfo = null;
      state.error = null;
    },
    setCredentials: (state, action) => {
      localStorage.setItem("driverUser", JSON.stringify(action.payload));
      state.userInfo = action.payload;
    },
  },
});

export const { logout, setCredentials } = driverSlice.actions;

export default driverSlice.reducer;
