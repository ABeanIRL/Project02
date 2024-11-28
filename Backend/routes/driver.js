import express from "express";
import {
  authenticate,
  register,
  login,
  logout,
  getDeliveriesReady,
  getDeliveriesInTransit,
  selectForDelivery,
  completeDelivery,
} from "../controllers/driver-controller.js";
import {
  driverRegister,
  driverLogin,
} from "../middlewares/driver-validation.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/register", driverRegister, register);

router.post("/login", driverLogin, login);

router.post("/logout", logout);

router.get("/deliveries/ready", authenticate, getDeliveriesReady);

router.post("/deliveries/in-transit", authenticate, getDeliveriesInTransit);

router.post("/delivery/:orderId/in-transit", selectForDelivery);

router.post(
  "/delivery/:orderId/complete",
  authenticate,
  upload.single("image"),
  completeDelivery
);

export default router;
