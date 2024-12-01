import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 255,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
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
    vehicleModel: {
      type: String,
      maxLength: 100,
      trim: true,
      default: null,
    },
    modelColor: {
      type: String,
      maxLength: 50,
      trim: true,
      default: null,
    },
    licensePlate: {
      type: String,
      maxLength: 15,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

export const Driver = mongoose.model("Driver", driverSchema);
