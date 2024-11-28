import express from "express";
import {
  getMenu,
  getOrderStatus,
  getOrdersByCustomer,
  createOrder,
  login,
  register,
  logout,
  authenticate,
} from "../controllers/restaurant-controller.js";
import { customerLogin, customerRegister } from "../middlewares/customer-validation.js";

const router = express.Router();

router.get("/", getMenu);

router.post("/login", customerLogin, login);

router.post("/register", customerRegister, register);

router.post("/logout", logout);

router.post("/order/status", authenticate, getOrderStatus);

router.post("/order", authenticate, createOrder);

router.get("/orders", getOrdersByCustomer);

export default router;
