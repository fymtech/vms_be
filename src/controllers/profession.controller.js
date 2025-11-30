const professionService = require("../services/profession.service");
const { errorResponseHandler } = require("../helpers/utils");

const create = async (req, res) => {
  try {
    const response = await professionService.create(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getAll = async (req, res) => {
  try {
    const response = await professionService.getAll();
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const updateById = async (req, res) => {
  try {
    const response = await professionService.updateById(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const deleteById = async (req, res) => {
  try {
    const response = await professionService.deleteById(req.body.id);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  create,
  getAll,
  updateById,
  deleteById,
};
