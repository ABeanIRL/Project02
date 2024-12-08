import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../features/auth/customerSlice.js";
import driverReudcer from "../features/auth/driverSlice.js"

export default configureStore({
  reducer: {
    customer: customerReducer,
    driver: driverReudcer,
  },
});
