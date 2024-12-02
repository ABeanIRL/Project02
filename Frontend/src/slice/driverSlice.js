import { createSlice } from "@reduxjs/toolkit";

export const driverSlice = createSlice({
  name: "driver",
  initialState: {
    value: null,
  },
  reducers: {
    setDriver: (state, action) => {
      state.value = action.payload;
    },
    updateDriver: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    clearDriver: (state) => {
      state.value = null;
    },
  },
});

export const { setDriver, updateDriver, clearDriver } = driverSlice.actions;

export default driverSlice.reducer;
