import bcrypt from "bcrypt";
import validator from "express-validator";
import { Driver } from "../models/driver.js";
import { Order } from "../models/order.js";
import {
  APP_ERROR_MESSAGE,
  HTTP_RESPONSE_CODE,
  ORDER_STATUS,
} from "../constants/constant.js";
import { RequestValidation } from "../utils/request-validator.js";
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

    const {
      username,
      password,
      firstName,
      lastName,
      vehicleModel,
      modelColor,
      licensePlate,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = Driver({
      username: username.trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      vehicleModel: vehicleModel && vehicleModel.trim(),
      modelColor: modelColor && modelColor.trim(),
      licensePlate: licensePlate && licensePlate.trim(),
    });
    await driver.save();
    
    if (!driver) {
      throw new HttpException();
    }

    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.createdUser,
          driver
        )
      );
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

    const { username, password } = req.body;
    const isEmail = validator.isEmail(username);
    const driver = await Driver.findOne(
      isEmail ? { email: username } : { username: username }
    ).exec();
    const match = await bcrypt.compare(password, driver.password);
    if (!match) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidCredentials
      );
    }
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...driverInfo } = driver.toObject();
    req.session.user = driverInfo;
    return res
      .status(HTTP_RESPONSE_CODE.SUCCESS)
      .send(
        RequestValidation.createAPIResponse(
          true,
          HTTP_RESPONSE_CODE.SUCCESS,
          APP_ERROR_MESSAGE.userReturned,
          driverInfo
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

export const getDeliveriesReady = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: ORDER_STATUS.ready }).exec();
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

export const selectForDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const driver = req.session.user;
    const newOrder = await Order.findByIdAndUpdate(
      { _id: orderId, status: ORDER_STATUS.ready },
      { status: ORDER_STATUS.transit, driver: driver._id },
      { new: true }
    ).exec();

    if (!newOrder) {
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
          newOrder
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getDeliveriesInTransit = async (req, res, next) => {
  try {
    const driver = req.session.user;
    const orders = await Order.find({
      driver: driver._id,
      status: ORDER_STATUS.transit,
    }).exec();

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

export const completeDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const driver = req.session.user;
    const file = req.file;

    if (!file) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidRequest
      );
    }

    const newOrder = await Order.findByIdAndUpdate(
      { _id: orderId, status: ORDER_STATUS.ready },
      {
        status: ORDER_STATUS.delivered,
        driver: driver._id,
        image: file.buffer,
      },
      { new: true }
    ).exec();

    if (!newOrder) {
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
          newOrder
        )
      );
  } catch (error) {
    next(error);
  }
};
