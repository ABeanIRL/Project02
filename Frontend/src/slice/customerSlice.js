import { createSlice } from "@reduxjs/toolkit";

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setCustomer: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateCustomer: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearCustomer: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCustomer,
  updateCustomer,
  clearCustomer,
  setLoading,
  setError,
} = customerSlice.actions;

export default customerSlice.reducer;
