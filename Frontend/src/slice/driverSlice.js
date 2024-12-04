import { createSlice } from "@reduxjs/toolkit";

export const driverSlice = createSlice({
  name: "driver",
  initialState: {
    user: {},
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setDriver: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateDriver: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearDriver: (state) => {
      state.user = {};
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

export const { setDriver, updateDriver, clearDriver, setLoading, setError } =
  driverSlice.actions;

export default driverSlice.reducer;
