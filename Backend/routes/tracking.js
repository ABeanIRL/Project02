import express from "express";
import {
  getOrders,
  getOrdersByCustomer,
  cancelOrder,
} from "../controllers/tracking-controllers.js";

const router = express.Router();

router.get("/orders", getOrders);

router.post("/orders/by/customer", getOrdersByCustomer);

router.post("/order/:orderId/cancel", cancelOrder);

export default router;
