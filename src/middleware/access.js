const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const { notFoundResponse } = require("../helpers/constants");

const { Role } = require("../models");

const checkAccess = (resource, action) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findById(req.user.roleID);

      if (!role) {
        const response = responseHandler(
          notFoundResponse("Role"),
          "",
          false,
          status.NOT_FOUND
        );
        return res.status(response.httpResponse).send(response);
      }

      const roleAccess = role.access;
      const resourceAccess = roleAccess[resource];

      if (!resourceAccess) {
        const response = responseHandler(
          `User does not have access to ${resource}`,
          "",
          false,
          status.FORBIDDEN
        );
        return res.status(response.httpResponse).send(response);
      }

      const requiredPermission = resourceAccess[action];

      if (requiredPermission === undefined) {
        const response = responseHandler(
          `Permission '${action}' is not defined for resource ${resource}`,
          "",
          false,
          status.FORBIDDEN
        );
        return res.status(response.httpResponse).send(response);
      }

      if (!requiredPermission) {
        const response = responseHandler(
          `User does not have required permission '${action}' for ${resource}`,
          "",
          false,
          status.FORBIDDEN
        );
        return res.status(response.httpResponse).send(response);
      }

      console.log("Access granted");
      // If the user has the required permission, continue with the next middleware
      next();
    } catch (error) {
      const errorResponse = errorResponseHandler(error);
      return res.status(errorResponse.httpResponse).send(errorResponse);
    }
  };
};

module.exports = { checkAccess };
