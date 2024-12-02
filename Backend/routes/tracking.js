import express from "express";
import {
  getReadyOrders,
  getTransitOrders,
  getDeliveredOrders,
  getCancelledOrders,
  getOrdersByCustomer,
  cancelOrder,
} from "../controllers/tracking-controllers.js";

const router = express.Router();

router.get("/orders/ready", getReadyOrders);

router.get("/orders/transit", getTransitOrders);

router.get("/orders/delivered", getDeliveredOrders);

router.get("/orders/cancelled", getCancelledOrders);

router.post("/orders/by/customer", getOrdersByCustomer);

router.post("/order/:orderId/cancel", cancelOrder);

export default router;
