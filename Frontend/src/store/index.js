import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../slice/customerSlice.js";
import driverReudcer from "../slice/driverSlice.js";

export default configureStore({
  reducer: {
    customer: customerReducer,
    driver: driverReudcer,
  },
});
