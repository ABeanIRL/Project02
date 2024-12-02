import express from "express";
import {
  authenticate,
  register,
  login,
  logout,
  getDeliveriesReady,
  getDeliveriesInTransit,
  getDeliveriesDelivered,
  selectForDelivery,
  completeDelivery,
} from "../controllers/driver-controller.js";
import {
  driverRegister,
  driverLogin,
  driverComplete,
} from "../middlewares/driver-validation.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/register", driverRegister, register);

router.post("/login", driverLogin, login);

router.post("/logout", logout);

router.get("/deliveries/ready", authenticate, getDeliveriesReady);

router.post("/deliveries/in-transit", authenticate, getDeliveriesInTransit);

router.post("/deliveries/delivered", authenticate, getDeliveriesDelivered);

router.post("/delivery/:orderId/in-transit", selectForDelivery);

router.post(
  "/delivery/:orderId/complete",
  authenticate,
  upload.single("image"),
  driverComplete,
  completeDelivery
);

export default router;
