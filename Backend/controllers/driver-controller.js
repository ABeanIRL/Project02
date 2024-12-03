import bcrypt from "bcrypt";
import validator from "express-validator";
import { Driver } from "../models/driver.js";
import { Order } from "../models/order.js";
import {
  APP_ERROR_MESSAGE,
  HTTP_RESPONSE_CODE,
  ORDER_STATUS,
} from "../constants/constant.js";
import { s3, BUCKET_NAME } from "../config/AWS-S3-config.js";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { RequestValidation } from "../utils/request-validator.js";
import { HttpException } from "../exceptions/exceptions.js";
import { Types } from "mongoose";
const { validationResult } = validator;

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

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidRequest,
        errors.errors
      );
    }

    const {
      username,
      email,
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
      email: email.trim(),
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

    const { email, password } = req.body;
    const driver = await Driver.findOne({ email }).exec();
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
  req.session.user = null;
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
    const orders = await Order.find({ status: ORDER_STATUS.ready })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .sort({ createdAt: 1 })
      .exec();

    const ordersWithTotals = orders.map((order) => {
      const total = order.total;
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

export const selectForDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const driver = req.session.user;

    if (!Types.ObjectId.isValid(orderId)) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidOrderIdFormat,
        `Expected a MongoID, got: ${orderId}`
      );
    }

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
    })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .sort({ createdAt: 1 })
      .exec();

    const ordersWithTotals = orders.map((order) => {
      const total = order.total;
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

export const getDeliveriesDelivered = async (req, res, next) => {
  try {
    const driver = req.session.user;
    const orders = await Order.find({
      driver: driver._id,
      status: ORDER_STATUS.delivered,
    })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .sort({ createdAt: 1 })
      .exec();

    const ordersWithTotals = orders.map((order) => {
      const total = order.total;
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

export const completeDelivery = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidRequest,
        errors.errors
      );
    }

    const { orderId } = req.params;
    const driver = req.session.user;
    const file = req.file;

    if (!Types.ObjectId.isValid(orderId)) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidOrderIdFormat,
        `Expected a MongoID, got: ${orderId}`
      );
    }

    const order = await Order.findById(orderId).exec();
    if (!order) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        APP_ERROR_MESSAGE.orderNotFound
      );
    }

    if (!file) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        APP_ERROR_MESSAGE.invalidRequest
      );
    }

    const convertedImage = await sharp(file.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .jpeg({ quality: 75 })
      .toBuffer();

    const filename = `${Date.now()}-${orderId}.jpg`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: `deliveries/${driver._id}/${filename}`,
      Body: convertedImage,
      ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const newOrder = await Order.findByIdAndUpdate(
      { _id: orderId, status: ORDER_STATUS.ready },
      {
        status: ORDER_STATUS.delivered,
        driver: driver._id,
        image: `deliveries/${driver._id}/${filename}`,
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
