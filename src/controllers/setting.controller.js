const settingService = require("../services/setting.service");
const { errorResponseHandler } = require("../helpers/utils");

const create = async (req, res) => {
  try {
    const response = await settingService.create(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const getSettings = async (req, res) => {
  try {
    const response = await settingService.getSettings();
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const updateById = async (req, res) => {
  try {
    const response = await settingService.updateById(req.body);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

const deleteById = async (req, res) => {
  try {
    const response = await settingService.deleteById(req.body.id);
    res.status(response.httpResponse).send(response);
  } catch (error) {
    const errorResponse = errorResponseHandler(error);
    res.status(errorResponse.httpResponse).send(errorResponse);
  }
};

module.exports = {
  create,
  getSettings,
  updateById,
  deleteById,
};
