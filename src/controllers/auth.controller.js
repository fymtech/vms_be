const authService = require("../services/auth.service");
const { errorResponseHandler } = require("../helpers/utils");

const register = async (req, res) => {
  try {
    const response = await authService.register(req.body, req.body.role);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const login = async (req, res) => {
  try {
    const response = await authService.login(req.body, req.params.userType);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const logout = async (req, res) => {
  try {
    const response = await authService.logout(
      req.user,
      req.authToken,
      req.params.userType
    );
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  register,
  login,
  logout,
};
