import { APP_ERROR_MESSAGE } from "../constants/constant.js";

// eslint-disable-next-line no-unused-vars
export default function errorMiddleware(error, req, res, next) {
  const status = error.status || 500;
  const message =
    status === 500
      ? APP_ERROR_MESSAGE.serverError
      : error.message || "An unexpected error occurred";
  const errors = error.error || null;
  const additionalData = error.additionalData || {};
  res
    .status(status)
    .send({
      success: false,
      status,
      message,
      error: errors,
      ...additionalData,
    });
}
