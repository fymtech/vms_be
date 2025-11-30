const itemService = require("../services/item.service");
const { errorResponseHandler } = require("../helpers/utils");

const create = async (req, res) => {
  try {
    const response = await itemService.create(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getAll = async (req, res) => {
  try {
    const response = await itemService.getAll();
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const updateById = async (req, res) => {
  try {
    const response = await itemService.updateById(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const deleteById = async (req, res) => {
  try {
    const response = await itemService.deleteById(req.body.id);
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
