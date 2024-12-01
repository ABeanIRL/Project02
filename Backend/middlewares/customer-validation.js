import validator from "express-validator";
import { Customer } from "../models/customer.js";
import { MenuItem } from "../models/menu-item.js";
import { HttpException } from "../exceptions/exceptions.js";
import {
  APP_ERROR_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "../constants/constant.js";
const { check } = validator;

export const customerRegister = [
  check("username")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Username must be a minimum 5 characters.")
    .custom(async (value) => {
      const existingUser = await Customer.findOne({ username: value }).exec();
      if (existingUser)
        throw new HttpException(
          HTTP_RESPONSE_CODE.CONFLICT,
          APP_ERROR_MESSAGE.existedUser
        );
    }),

  check("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .bail()
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await Customer.findOne({ email: value }).exec();
      if (existingUser)
        throw new HttpException(
          HTTP_RESPONSE_CODE.CONFLICT,
          APP_ERROR_MESSAGE.existedEmail
        );
    }),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be a minimum of 8 characters")
    .bail()
    .matches(/\d/)
    .withMessage("Password must contain at least one numeric character")
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password should contain at least one special character"),

  check("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  check("fistName")
    .trim()
    .isLength({ max: 50 })
    .withMessage("First name must be a maximum of 50 characters"),

  check("lastName")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Last name must be a maximum of 50 characters"),

  check("address")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Address must be a maximum of 255 characters"),
];

export const customerLogin = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("password").exists().withMessage("Incorrect password"),
];

export const customerOrder = [
  check("customerId")
    .isMongoId()
    .withMessage("Invalid Customer ID")
    .bail()
    .custom(async (value, { req }) => {
      const customer = await Customer.findById(value).exec();
      if (!customer) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          APP_ERROR_MESSAGE.invalidCustomerId
        );
      }
      req.customer = customer;
    }),

  check("firstName")
    .isLength({ max: 50 })
    .withMessage("First name must be a maximum of 50 characters")
    .bail()
    .custom(async (value, { req }) => {
      if (req.customer.firstName !== value) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "First name does not match the customer's record"
        );
      }
      return true;
    })
    .withMessage("First name does not match the customer's record"),

  check("lastName")
    .isLength({ max: 50 })
    .withMessage("Last name must be a maximum of 50 characters")
    .bail()
    .custom(async (value, { req }) => {
      if (req.customer.lastName !== value) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "Last name does not match the customer's record"
        );
      }
      return true;
    })
    .withMessage("Last name does not match customer's record"),

  check("deliveryAddress")
    .isLength({ max: 255 })
    .withMessage("Address must be a maximum of 50 characters")
    .bail()
    .custom(async (value, { req }) => {
      if (req.customer.address !== value) {
        throw new HttpException(
          HTTP_RESPONSE_CODE.BAD_REQUEST,
          "Address does not match the customer's record"
        );
      }
      return true;
    })
    .withMessage("Address does not match the customer's record"),

  check("items")
    .isArray({ min: 1 })
    .withMessage("Items must be an array with at least one item.")
    .bail()
    .custom(async (items) => {
      for (const item of items) {
        if (!item.menuItem || !item.quantity) {
          throw new HttpException(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            "Each item must have a menuItem and quantity."
          );
        }

        const menuItem = await MenuItem.findById(item.menuItem).exec();
        if (!menuItem) {
          throw new HttpException(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            `MenuItem with ID ${item.menuItem} does not exist.`
          );
        }

        if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
          throw new HttpException(
            HTTP_RESPONSE_CODE.BAD_REQUEST,
            "Item quantity must be a positive integer."
          );
        }
      }
    }),
];

export const customerOrderStatus = [
  check("orderId")
    .isMongoId()
    .withMessage("Invalid order ID")
];
