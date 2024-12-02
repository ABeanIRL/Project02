import { createSlice } from "@reduxjs/toolkit";

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    value: {},
  },
  reducers: {
    setCustomer: (state, action) => {
      state.value = action.payload;
    },
    updateCustomer: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
    clearCustomer: (state) => {
      state.value = {};
    },
  },
});

export const { setCustomer, updateCustomer, clearCustomer } =
  customerSlice.actions;

export default customerSlice.reducer;
