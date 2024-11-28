import bcrypt from "bcrypt";
import validator from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order.js";
import { MenuItem } from "../models/menu-item.js";
import { Customer } from "../models/customer.js";
import { RequestValidation } from "../utils/request-validator.js";
import {
  HTTP_RESPONSE_CODE,
  APP_ERROR_MESSAGE,
} from "../constants/constant.js";
import { HttpException } from "../exceptions/exceptions.js";
const { validationResult } = validator;

export const authenticate = (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(HTTP_RESPONSE_CODE.UNAUTHORIZED).send({
        error: "user not allowed to perform this action, login to continue",
        redirectUrl: "/login",
      });
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
    const user = await Customer.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCredentials
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCredentials
      );
    }
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userInfo } = user.toObject();
    req.session.user = userInfo;
    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.userReturned,
          userInfo
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
  req.session.destroy((err) => {
    if (err) {
      throw new HttpException();
    } else {
      res.status(200);
    }
  });
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
    const order = Order({
      customerId: mongoose.Types.ObjectId(customerId),
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
    next(error);
  }
};

export const getOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.find({ _id: orderId }).exec();

    if (!order) {
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
          APP_ERROR_MESSAGE.orderReturned,
          order.status
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
