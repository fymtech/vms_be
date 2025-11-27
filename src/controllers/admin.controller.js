const { status: httpStatus } = require("http-status");

const adminService = require("../services/admin.service");
const { errorResponseHandler } = require("../helpers/utils");

const verfiyEmail = async (req, res) => {
  try {
    console.log("Admin controller: Verifying email:", req.query.email);
    const response = await adminService.verifyEmail(req.query.email);
    if (response.status == false)
      res.status(response.httpResponse).send(response);
    else res.status(httpStatus.OK).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const response = await adminService.getAllAdmins();
    if (response.status == false)
      res.status(response.httpResponse).send(response);
    else res.status(httpStatus.OK).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  verfiyEmail,
  getAllAdmins,
};
