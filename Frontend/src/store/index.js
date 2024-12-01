import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../slice/customerSlice.js";

export default configureStore({
  reducer: {
    customer: customerReducer,
  },
});
