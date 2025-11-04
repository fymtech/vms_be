const { status: httpStatus } = require("http-status");

const customerService = require("../services/customer.service");
const { errorResponseHandler } = require("../helpers/utils");

const verfiyEmail = async (req, res) => {
  try {
    const response = await customerService.verifyEmail(req.query.email);
    if (response.status == false)
      res.status(response.httpResponse).send(response);
    else res.status(httpStatus.OK).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getHomePage = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await customerService.getHomePage(
      parseInt(page),
      parseInt(limit)
    );
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  verfiyEmail,
  getHomePage,
};
