const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");

const { Roles, Tokens } = require("../models");
const customerService = require("./customer.service");
const adminService = require("./admin.service");

const register = async (body, userType) => {
  try {
    console.log("Registering user with type:", userType);
    const role = await Roles.findOne({ name: userType });
    if (!role) {
      return responseHandler(
        notFoundResponse("Role/User type"),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    }
    switch (userType) {
      case "CUSTOMER":
        const responseC = await customerService.register(body, role._id);
        console.log(
          "Customer registration response in auth service:",
          responseC
        );
        return responseC;
      case "ADMIN":
        const responseA = await adminService.register(body, role._id);
        console.log("Admin registration response in auth service:", responseA);
        return responseA;

      case "SUPPORT":
        // Handle support registration logic here
        return responseHandler(CustomSuccessResponse.REGISTERED, null);

      default:
        return responseHandler(
          CustomErrorResponse.INVALID_USER_TYPE,
          null,
          false,
          status.BAD_REQUEST,
          true
        );
    }
  } catch (error) {
    return errorResponseHandler(error);
  }
};

const login = async (body, userType) => {
  try {
    console.log("Registering user with type:", userType);
    const { email, password, deviceType } = body;
    console.log(
      "email: ",
      email,
      "\npassword: ",
      password,
      "\ndevice type: ",
      deviceType
    );
    switch (userType) {
      case "customer":
        const responseC = await customerService.login(
          email,
          password,
          deviceType
        );
        console.log("Customer login response in auth service:", responseC);
        return responseC;
      case "admin":
        const responseA = await adminService.login(email, password, deviceType);
        console.log("Admin login response in auth service:", responseA);
        return responseA;

      case "support":
        // Handle support registration logic here
        return responseHandler(CustomSuccessResponse.REGISTERED, null);

      default:
        return responseHandler(
          CustomErrorResponse.INVALID_USER_TYPE,
          null,
          false,
          status.BAD_REQUEST,
          true
        );
    }
  } catch (error) {
    return errorResponseHandler(error);
  }
};

const logout = async (user, authToken, userType) => {
  try {
    switch (userType) {
      case "customer":
        const responseC = await customerService.logout(user, authToken);
        return responseC;
      case "admin":
        const responseA = await adminService.logout(user, authToken);
        return responseA;
      default:
        return responseHandler(
          CustomErrorResponse.INVALID_USER_TYPE,
          null,
          false,
          status.BAD_REQUEST,
          true
        );
    }
    // Check if the auth Token matches with the user of specific type

    return responseHandler(CustomSuccessResponse.USER_LOGOUT_SUCCESS, null);
  } catch (error) {
    console.log("Error occured while loggin out: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
