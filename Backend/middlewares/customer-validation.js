import validator from "express-validator";
import { Customer } from "../models/customer.js";
import { HttpException } from "../exceptions/exceptions.js";
import {
  APP_ERROR_MESSAGE,
  HTTP_RESPONSE_CODE,
} from "../constants/constant.js";
const { check } = validator;

export const customerRegister = [
  check("username")
    .bail()
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
    .bail()
    .isEmail()
    .withMessage("Please enter a valid email")
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
    .bail()
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
];

export const customerLogin = [
  check("email").isEmail().withMessage("Invalid email address."),
  check("password").exists().withMessage("Incorrect password"),
];
