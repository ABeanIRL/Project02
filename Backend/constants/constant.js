export const HTTP_RESPONSE_CODE = {
    NOT_FOUND: 404,
    CREATED: 201,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500,
  };
  
  export const HttpStatusCode = {
    NOT_FOUND: 404,
    CREATED: 201,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
  }

  export const APP_ERROR_MESSAGE = {
    serverError: "Something went wrong, try again later",
    createdUser: "User created successfully",
    existedUser: "Username already taken",
    existedEmail: "Email already taken",
    userReturned: "User returned successfully",
    ordersReturned: "Orders returned successfully",
    createdOrder: "Order created successfully",
    orderReturned: "Order returned successfully",
    orderUpdated: "Order updated successfully",
    ordersNotFound: "No orders found",
    orderNotFound: "No order found",
    menuReturned: "Menu items returned successfully",
    menuNotFound: "No menu items found",
    invalidCredentials: "Invalid user email or password",
    invalidEmail: "Enter a valid email address",
    invalidCustomerId: "No user with this ID found",
    invalidRequest: "Request body could not be read properly",
  };

  export const ORDER_STATUS = {
    ready: 'READY_FOR_DELIVERY', 
    transit: 'IN_TRANSIT',
    delivered: 'DELIVERED', 
    cancelled: 'CANCELLED'
  }