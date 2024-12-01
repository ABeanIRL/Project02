import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/constant.js";

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      maxLength: 255,
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        {
          validator: (v) => Array.isArray(v) && v.length > 0,
          message: "An order must have at least one item.",
        },
        {
          validator: (v) => v.every((item) => item.quantity > 0),
          message: "Each item must have a quantity greater than 0.",
        },
      ],
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.ready,
      index: true,
    },
    image: {
      type: Buffer,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.virtual("total").get(function () {
  return this.items.reduce(
    (sum, item) => sum + item.quantity * item.menuItem.price,
    0
  );
});

export const Order = mongoose.model("Order", orderSchema);
