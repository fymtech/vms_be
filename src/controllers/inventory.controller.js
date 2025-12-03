const inventoryService = require("../services/inventory.service");
const { errorResponseHandler } = require("../helpers/utils");

const create = async (req, res) => {
  try {
    const response = await inventoryService.create(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getAll = async (req, res) => {
  try {
    const response = await inventoryService.getAll();
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getById = async (req, res) => {
  try {
    const response = await inventoryService.getById(req.params.id);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const updateById = async (req, res) => {
  try {
    const response = await inventoryService.updateById(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const deleteById = async (req, res) => {
  try {
    const response = await inventoryService.deleteById(req.body.id);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
