import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    requried: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  vehicleModel: String,
  modelColor: String,
  licensePlate: String,
});

export const Driver = mongoose.model("Driver", driverSchema);
