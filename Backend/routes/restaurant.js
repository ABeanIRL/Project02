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
import {
  customerLogin,
  customerRegister,
  customerOrder,
  customerOrderStatus
} from "../middlewares/customer-validation.js";

const router = express.Router();

router.get("/", getMenu);

router.post("/login", customerLogin, login);

router.post("/register", customerRegister, register);

router.post("/logout", logout);

router.post("/order/status", customerOrderStatus, getOrderStatus);

router.post("/order", customerOrder, authenticate, createOrder);

router.get("/orders", getOrdersByCustomer);

export default router;
