import { APP_ERROR_MESSAGE } from "../constants/constant.js";

// eslint-disable-next-line no-unused-vars
export default function errorMiddleware(error, req, res, next) {
  const status = error.status || 500;
  const message =
    status === 500 ? APP_ERROR_MESSAGE.serverError : error.message;
  const errors = error.error || null;
  res.status(status).send({ success: false, status, message, error: errors });
}
