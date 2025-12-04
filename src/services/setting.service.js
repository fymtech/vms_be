const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { Settings } = require("../models");

const create = async (body) => {
  try {
    const setting = await Settings.create(body);
    console.log("Setting creates successfully:", setting);
    return responseHandler(CustomSuccessResponse.CREATED, null);
  } catch (error) {
    console.error("Error creating setting:", error);
    return errorResponseHandler(error);
  }
};

const getSettings = async () => {
  try {
    const settings = await Settings.find();
    if (!settings || settings.length == 0) {
      return responseHandler(
        notFoundResponse("Settings"),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    }
    return responseHandler(CustomSuccessResponse.FETCHED, settings[0]);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return errorResponseHandler(error);
  }
};

const updateById = async (body) => {
  try {
    const { id, ...updateBody } = body;
    const setting = await Settings.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true, runValidators: true }
    );
    if (!setting)
      return responseHandler(
        notFoundResponse(`Setting with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.UPDATED, setting);
  } catch (error) {
    console.error("Error updating setting: ", error);
    return errorResponseHandler(error);
  }
};

const deleteById = async (id) => {
  try {
    const setting = await Settings.findByIdAndDelete(id);
    if (!setting)
      return responseHandler(
        notFoundResponse(`Setting with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.DELETED, null);
  } catch (error) {
    console.error("Error deleting setting: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  create,
  getSettings,
  updateById,
  deleteById,
};
