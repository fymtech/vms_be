const { status } = require("http-status");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const { CustomErrorResponse } = require("../helpers/constants");
const { Tokens } = require("../models");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from the "Bearer <token>" format
    if (!token) {
      const response = responseHandler(
        CustomErrorResponse.NO_TOKEN_PROVIDED,
        "",
        false,
        status.UNAUTHORIZED
      );
      return res.status(response.httpResponse).send(response);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    req.authToken = token;
    next();
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    return res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const checkUserType = async (req, res, next) => {
  try {
    const userType = req.originalUrl.split("/")[2];
    console.log(userType);
    const token = await Tokens.findOne({ token: req.authToken });
    if (!token || token == null) {
      const response = responseHandler(
        CustomErrorResponse.INVALID_TOKEN,
        "",
        false,
        status.UNAUTHORIZED
      );
      return res.status(response.httpResponse).send(response);
    }
    switch (userType) {
      case "admin":
        if (token.admin == null) {
          const responseC = responseHandler(
            CustomErrorResponse.INVALID_TOKEN,
            "",
            false,
            status.UNAUTHORIZED
          );
          return res.status(responseC.httpResponse).send(responseC);
        }
        next();
        break;
      default:
        const responseD = responseHandler(
          CustomErrorResponse.INVALID_USER_TYPE,
          "",
          false,
          status.UNAUTHORIZED
        );
        return res.status(responseD.httpResponse).send(responseD);
    }
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    return res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  authenticateToken,
  checkUserType,
};
