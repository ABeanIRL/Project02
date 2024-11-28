import { Order } from "../models/order.js";
import {
  APP_ERROR_MESSAGE,
  HTTP_RESPONSE_CODE,
  ORDER_STATUS,
} from "../constants/constant.js";
import { HttpException } from "../exceptions/exceptions.js";
import { RequestValidation } from "../utils/request-validator.js";

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).exec();

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          orders
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
        APP_ERROR_MESSAGE.invalidRequest
      );
    }

    const orders = await Order.find({ customerId });

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          orders
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

    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { status: ORDER_STATUS.cancelled },
      { new: true }
    ).exec();

    if (!updatedOrder) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_ERROR_MESSAGE.orderNotFound
      );
    }

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.orderUpdated,
          updatedOrder
        )
      );
  } catch (error) {
    next(error);
  }
};
