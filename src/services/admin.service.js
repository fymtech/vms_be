const { status } = require("http-status");

const {
  responseHandler,
  errorResponseHandler,
  sendVerificationEmail,
} = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { generateLoginAuthToken } = require("../helpers/utils");
const { Admins, Tokens } = require("../models");

const register = async (body, roleId) => {
  try {
    console.log("Registering user with type:", roleId, "in admin service");
    body.role = roleId;
    const admin = await Admins.create({
      ...body,
      registeredAt: new Date(),
      status: 0,
      active: 1,
      isEmailVerified: 0,
      isPhoneVerified: 0,
      walletBalance: 0.0,
    });
    console.log("Admin registered successfully:", admin);
    // Send OTP to the admin in a separate thread (non-blocking)
    // setImmediate(() => {
    //   sendVerificationEmail(admin.email);
    // });
    setTimeout(() => {
      sendVerificationEmail(admin.email, "admin");
    }, 5000);
    return responseHandler(CustomSuccessResponse.REGISTERED, null);
  } catch (error) {
    console.error("Error registering admin:", error);
    return errorResponseHandler(error);
  }
};

const verifyEmail = async (email) => {
  try {
    console.log("Verifying email:", email);
    const admin = await Admins.findOne({ email });
    if (!admin)
      return responseHandler(
        notFoundResponse(`Admin with email: ${email}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    if (admin.isEmailVerified)
      return responseHandler(
        CustomSuccessResponse.ALREADY_VERIFIED +
          " on " +
          admin.emailVerifiedAt.toLocaleDateString("en-GB") +
          ".",
        null,
        false,
        status.CONFLICT,
        false
      );
    admin.isEmailVerified = true;
    admin.emailVerifiedAt = new Date();
    await admin.save();
    console.log("Email verified successfully for:", email);
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
        status.BAD_REQUEST,
        true
      );
    const admin = await Admins.findOne({ email: email });
    if (!admin)
      return responseHandler(
        notFoundResponse(`Admin with email: ${email}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    const isValidPassword = await admin.isValidPassword(password);
    if (!isValidPassword)
      return responseHandler(
        CustomErrorResponse.INCORRECT_PASSWORD,
        null,
        false,
        status.FORBIDDEN,
        true
      );
    const loginToken = await generateLoginAuthToken(admin);
    if (loginToken.isError) {
      return loginToken;
    }
    const token = await Tokens.create({
      token: loginToken,
      admin: admin._id,
      expired: false,
      revoked: false,
    });
    console.log("Token for the admin: ", token);
    admin.status = 1;
    admin.loggedInAt = new Date();
    admin.deviceType = deviceType;
    await admin.save();
    return responseHandler(CustomSuccessResponse.USER_LOGIN_SUCCESS, {
      loginToken: loginToken,
      adminId: admin._id,
    });
  } catch (error) {
    console.log("Error occured while logging in: ", error);
    return errorResponseHandler(error);
  }
};

const logout = async (user, authToken) => {
  try {
    console.log(user, "logout in admin service");
    const token = await Tokens.findOne({ token: authToken });
    if (!token)
      return responseHandler(
        notFoundResponse("Token"),
        null,
        false,
        status.FORBIDDEN,
        true
      );
    if (!token.admin || token.admin == null)
      return responseHandler(
        "Not admin's token.",
        null,
        false,
        status.BAD_REQUEST,
        true
      );
    const admin = await Admins.findOne({
      _id: user.userId || token.admin,
    });
    if (!admin)
      return responseHandler(
        notFoundResponse(`Admin with id: ${user.userId}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    admin.status = 0;
    admin.loggedOutAt = new Date();
    await admin.save();

    token.loggedOut = true;
    token.loggedOutAt = new Date();
    await token.save();
    return responseHandler(CustomSuccessResponse.USER_LOGOUT_SUCCESS, null);
  } catch (error) {
    console.log("Error occured while logging in: ", error);
    return errorResponseHandler(error);
  }
};

const getAllAdmins = async () => {
  try {
    const admins = await Admins.find();
    if (!admins || admins.length === 0) {
      return responseHandler(
        notFoundResponse("Admins"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }
    return responseHandler(CustomSuccessResponse.FETCHED, admins);
  } catch (error) {
    console.error("Error occured while fetching admins: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  getAllAdmins,
};
