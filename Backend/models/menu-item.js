import mongoose from "mongoose";

export const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 255,
      trim: true,
      index: true,
    },
    image: { type: Buffer, required: false },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
