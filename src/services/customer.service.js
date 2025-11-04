const { status: httpStatus } = require("http-status");

const {
  responseHandler,
  responseHandlerForPagination,
  errorResponseHandler,
  sendVerificationEmail,
} = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { generateLoginAuthToken } = require("../helpers/utils");
const { Customers, Tokens } = require("../models");

const register = async (body, roleId) => {
  try {
    console.log("Registering user with type:", roleId, "in customer service");
    body.role = roleId;
    const customer = await Customers.create({
      ...body,
      registeredAt: new Date(),
      status: 0,
      active: 1,
      isEmailVerified: 0,
      isPhoneVerified: 0,
      walletBalance: 0.0,
    });
    console.log("Customer registered successfully:", customer);
    // Send OTP to the customer in a separate thread (non-blocking)
    // setImmediate(() => {
    //   sendVerificationEmail(customer.email);
    // });
    setTimeout(() => {
      sendVerificationEmail(customer.email, "customer");
    }, 5000);
    return responseHandler(CustomSuccessResponse.REGISTERED, null);
  } catch (error) {
    console.error("Error registering customer:", error);
    return errorResponseHandler(error);
  }
};

const verifyEmail = async (email) => {
  try {
    console.log("Verifying email:", email);
    const customer = await Customers.findOne({ email });
    if (!customer)
      return responseHandler(
        notFoundResponse(`Customer with email: ${email}`),
        null,
        false,
        httpStatus.NOT_FOUND,
        true
      );
    if (customer.isEmailVerified)
      return responseHandler(
        CustomSuccessResponse.ALREADY_VERIFIED +
          " on " +
          customer.emailVerifiedAt.toLocaleDateString("en-GB") +
          ".",
        null,
        false,
        httpStatus.CONFLICT,
        false
      );
    customer.isEmailVerified = true;
    customer.emailVerifiedAt = new Date();
    await customer.save();
    console.log("Email verified successfully for:", email);
    // Return both JSON and HTML response
    return `<html><body><h2>Email Verified Successfully!</h2><p>Your email (${email}) has been verified.</p></body></html>`;
  } catch (error) {
    console.error("Error verifying email:", error);
    return errorResponseHandler(error);
  }
};

const login = async (email, password, deviceType) => {
  try {
    if (email == null || password == null)
      return responseHandler(
        "Username or password is empty.",
        null,
        false,
        httpStatus.BAD_REQUEST,
        true
      );
    const customer = await Customers.findOne({ email: email });
    if (!customer)
      return responseHandler(
        notFoundResponse(`Customer with email: ${email}`),
        null,
        false,
        httpStatus.NOT_FOUND,
        true
      );
    const isValidPassword = await customer.isValidPassword(password);
    if (!isValidPassword)
      return responseHandler(
        CustomErrorResponse.INCORRECT_PASSWORD,
        null,
        false,
        httpStatus.FORBIDDEN,
        true
      );
    const loginToken = await generateLoginAuthToken(customer);
    if (loginToken.isError) {
      return loginToken;
    }
    const token = await Tokens.create({
      token: loginToken,
      customer: customer._id,
      expired: false,
      revoked: false,
    });
    console.log("Token for the customer: ", token);
    customer.status = 1;
    customer.loggedInAt = new Date();
    customer.deviceType = deviceType;
    await customer.save();
    return responseHandler(CustomSuccessResponse.USER_LOGIN_SUCCESS, {
      loginToken: loginToken,
      customerId: customer._id,
    });
  } catch (error) {
    console.log("Error occured while logging in: ", error);
    return errorResponseHandler(error);
  }
};

const logout = async (user, authToken) => {
  try {
    console.log(user, "in customer service");
    const token = await Tokens.findOne({ token: authToken });
    if (!token)
      return responseHandler(
        notFoundResponse("Token"),
        null,
        false,
        httpStatus.FORBIDDEN,
        true
      );
    if (!token.customer || token.customer == null)
      return responseHandler(
        "Not customer's token.",
        null,
        false,
        httpStatus.BAD_REQUEST,
        true
      );
    const customer = await Customers.findOne({
      _id: user.userId || token.customer,
    });
    if (!customer)
      return responseHandler(
        notFoundResponse(`Customer with id: ${user.userId}`),
        null,
        false,
        httpStatus.NOT_FOUND,
        true
      );
    customer.status = 0;
    customer.loggedOutAt = new Date();
    await customer.save();

    token.loggedOut = true;
    token.loggedOutAt = new Date();
    await token.save();
    return responseHandler(CustomSuccessResponse.USER_LOGOUT_SUCCESS, null);
  } catch (error) {
    console.log("Error occured while logging in: ", error);
    return errorResponseHandler(error);
  }
};

const getHomePage = async (page, limit) => {
  try {
    return responseHandlerForPagination("Hi", null);
  } catch (error) {
    console.log("Error occured while logging in: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  getHomePage,
};
