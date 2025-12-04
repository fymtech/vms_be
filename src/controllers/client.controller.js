const clientService = require("../services/client.service");
const { errorResponseHandler } = require("../helpers/utils");

const register = async (req, res) => {
  try {
    const response = await clientService.register(req.body, "CLIENT");
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getAllClients = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const response = await clientService.getAllClients(page, limit, search);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getClientById = async (req, res) => {
  try {
    const response = await clientService.getClientById(req.params.id);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  register,
};
