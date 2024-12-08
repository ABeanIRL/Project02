import bcrypt from "bcrypt";
import validator from "express-validator";
import { Order } from "../models/order.js";
import { MenuItem } from "../models/menu-item.js";
import { Customer } from "../models/customer.js";
import { RequestValidation } from "../utils/request-validator.js";
import {
  HTTP_RESPONSE_CODE,
  APP_ERROR_MESSAGE,
  ORDER_STATUS,
} from "../constants/constant.js";
import { HttpException } from "../exceptions/exceptions.js";
import { BUCKET_NAME, s3 } from "../config/AWS-S3-config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { streamToBase64 } from "../utils/converter.js";
const { validationResult } = validator;

export const checkSession = (req, res, next) => {
  try {
    if (req.session.user) {
      return res
        .status(HTTP_RESPONSE_CODE.SUCCESS)
        .send(
          RequestValidation.createAPIResponse(
            true,
            HTTP_RESPONSE_CODE.SUCCESS,
            APP_ERROR_MESSAGE.userReturned,
            req.session.user
          )
        );
    } else {
      if (req.session.user) {
        return res
          .status(HTTP_RESPONSE_CODE.SUCCESS)
          .send(
            RequestValidation.createAPIResponse(
              true,
              HTTP_RESPONSE_CODE.SUCCESS,
              "No valid session",
              null
            )
          );
      }
    }
  } catch (error) {
    next(error);
  }
};

export const authenticate = (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "user not allowed to perform this action, login to continue",
        null,
        { redirectUrl: "/login" }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCredentials,
        errors.errors
      );
    }

    const { email, password } = req.body;
    const customer = await Customer.findOne({ email }).exec();
    if (!customer) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCredentials
      );
    }
    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCredentials
      );
    }
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...customerInfo } = customer.toObject();
    req.session.user = customerInfo;
    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.userReturned,
          customerInfo
        )
      );
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCredentials,
        errors.errors
      );
    }

    const { password, email, username, firstName, lastName, address } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = Customer({
      email: email.trim(),
      username: username.trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
    });

    await user.save();
    if (!user) {
      throw new HttpException();
    }
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userInfo } = user.toObject();
    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.createdUser,
          userInfo
        )
      );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  req.session.destroy();
  return res
    .status(HTTP_RESPONSE_CODE.SUCCESS)
    .send(
      RequestValidation.createAPIResponse(
        true,
        HTTP_RESPONSE_CODE.SUCCESS,
        "User logged out",
        null
      )
    );
};

export const getMenu = async (req, res, next) => {
  try {
    const items = await MenuItem.find().exec();
    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.ordersReturned,
          items
        )
      );
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { customerId, firstName, lastName, deliveryAddress, items } =
      req.body;
    console.log(req.body)
    const order = Order({
      customerId: customerId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      deliveryAddress: deliveryAddress.trim(),
      items: JSON.parse(items),
    });
    await order.save();
    if (!order) {
      throw new HttpException();
    }
    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.orderReturned,
          order._id
        )
      );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId)
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .exec();

    if (!order) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_ERROR_MESSAGE.orderNotFound
      );
    }

    const total = order.total;
    const orderWithTotal = {
      ...order.toObject(),
      total,
    };

    if (order.status !== ORDER_STATUS.delivered) {
      return res
        .status(HTTP_RESPONSE_CODE.SUCCESS)
        .send(
          RequestValidation.createAPIResponse(
            true,
            HTTP_RESPONSE_CODE.SUCCESS,
            APP_ERROR_MESSAGE.orderReturned,
            orderWithTotal
          )
        );
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: order.image,
    };

    const command = new GetObjectCommand(params);
    const data = await s3.send(command);
    const content = await streamToBase64(data.Body);
    const orderWithImage = {
      ...orderWithTotal,
      imageData: content,
    };
    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.orderReturned,
          orderWithImage
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getOrdersByCustomer = async (req, res, next) => {
  try {
    const user = req.session.user;
    const orders = await Order.find({ customerId: user._id }).exec();
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
