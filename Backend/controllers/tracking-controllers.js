import { Order } from "../models/order.js";
import {
  APP_ERROR_MESSAGE,
  HTTP_RESPONSE_CODE,
  ORDER_STATUS,
} from "../constants/constant.js";
import { HttpException } from "../exceptions/exceptions.js";
import { RequestValidation } from "../utils/request-validator.js";
import mongoose from "mongoose";

export const getReadyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: ORDER_STATUS.ready })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .sort({ createdAt: -1 })
      .exec();

    const ordersWithTotals = orders.map((order) => {
      const total = order.items.reduce((sum, item) => {
        return sum + (item?.menuItem?.price || 0) * item.quantity;
      }, 0);
      return {
        ...order.toObject(),
        total,
      };
    });

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          ordersWithTotals
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getTransitOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: ORDER_STATUS.transit })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .sort({ createdAt: -1 })
      .exec();

    const ordersWithTotals = orders.map((order) => {
      const total = order.items.reduce((sum, item) => {
        return sum + (item?.menuItem?.price || 0) * item.quantity;
      }, 0);
      return {
        ...order.toObject(),
        total,
      };
    });

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          ordersWithTotals
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getDeliveredOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: ORDER_STATUS.delivered })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .sort({ createdAt: -1 })
      .exec();

    const ordersWithTotals = orders.map((order) => {
      const total = order.items.reduce((sum, item) => {
        return sum + (item?.menuItem?.price || 0) * item.quantity;
      }, 0);
      return {
        ...order.toObject(),
        total,
      };
    });

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          ordersWithTotals
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getCancelledOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: ORDER_STATUS.cancelled })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .sort({ createdAt: -1 })
      .exec();

    const ordersWithTotals = orders.map((order) => {
      const total = order.items.reduce((sum, item) => {
        return sum + (item?.menuItem?.price || 0) * item.quantity;
      }, 0);
      return {
        ...order.toObject(),
        total,
      };
    });

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          ordersWithTotals
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCustomerId
      );
    }

    let orders;
    const groupedOrders = {
      ready: [],
      transit: [],
      delivered: [],
      cancelled: [],
    };
    if (customerId && customerId.length < 24) {
      orders = await Order.find({
        $or: [
          { firstName: { $regex: customerId, $options: "i" } },
          { lastName: { $regex: customerId, $options: "i" } },
        ],
      })
        .populate({
          path: "items.menuItem",
          select: "name price",
        })
        .exec();

      if (!orders.length) {
        return res
          .status(HTTP_RESPONSE_CODE.SUCCESS)
          .send(
            RequestValidation.createAPIResponse(
              true,
              HTTP_RESPONSE_CODE.SUCCESS,
              APP_ERROR_MESSAGE.ordersReturned,
              groupedOrders
            )
          );
      }
    } else {
      if (!mongoose.isValidObjectId(customerId)) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          APP_ERROR_MESSAGE.invalidCustomerId
        );
      }

      orders = await Order.find({
        customerId: new mongoose.Types.ObjectId(String(customerId)),
      })
        .populate({
          path: "items.menuItem",
          select: "name price",
        })
        .exec();
    }

    const ordersWithTotals = orders.map((order) => {
      const total = order.items.reduce((sum, item) => {
        return sum + (item?.menuItem?.price || 0) * item.quantity;
      }, 0);
      return {
        ...order.toObject(),
        total,
      };
    });

    ordersWithTotals.forEach((order) => {
      switch (order.status) {
        case ORDER_STATUS.ready:
          groupedOrders.ready.push(order);
          break;
        case ORDER_STATUS.transit:
          groupedOrders.transit.push(order);
          break;
        case ORDER_STATUS.delivered:
          groupedOrders.delivered.push(order);
          break;
        case ORDER_STATUS.cancelled:
          groupedOrders.cancelled.push(order);
          break;
        default:
          break;
      }
    });

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          groupedOrders
        )
      );
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Order ID is required"
      );
    }

    const order = await Order.findById(orderId).exec();

    if (!order) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_ERROR_MESSAGE.orderNotFound
      );
    }

    if (
      order.status === ORDER_STATUS.delivered ||
      order.status === ORDER_STATUS.cancelled
    ) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        `Orders with status '${order.status}' cannot be canceled.`
      );
    }

    order.status = ORDER_STATUS.cancelled;
    const updatedOrder = await order.save();
    const total = order.items.reduce((sum, item) => {
      return sum + (item?.menuItem?.price || 0) * item.quantity;
    }, 0);
    const updatedOrderWithTotal = {
      ...updatedOrder.toObject(),
      total,
    };

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.orderUpdated,
          updatedOrderWithTotal
        )
      );
  } catch (error) {
    next(error);
  }
};
