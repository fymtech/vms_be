const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { Professions } = require("../models");

const create = async (body) => {
  try {
    const profession = await Professions.create(body);
    console.log("Profession creates successfully:", profession);
    return responseHandler(CustomSuccessResponse.CREATED, null);
  } catch (error) {
    console.error("Error creating profession:", error);
    return errorResponseHandler(error);
  }
};

const getAll = async () => {
  try {
    const professions = await Professions.find();
    if (!professions || professions.length == 0) {
      return responseHandler(
        notFoundResponse("Professions"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }
    return responseHandler(CustomSuccessResponse.FETCHED, professions);
  } catch (error) {
    console.error("Error fetching professions:", error);
    return errorResponseHandler(error);
  }
};

const updateById = async (body) => {
  try {
    const { id, ...updateBody } = body;
    const profession = await Professions.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true, runValidators: true }
    );
    if (!profession)
      return responseHandler(
        notFoundResponse(`Profession with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.UPDATED, profession);
  } catch (error) {
    console.error("Error updating profession: ", error);
    return errorResponseHandler(error);
  }
};

const deleteById = async (id) => {
  try {
    const profession = await Professions.findByIdAndDelete(id);
    if (!profession)
      return responseHandler(
        notFoundResponse(`Profession with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.DELETED, null);
  } catch (error) {
    console.error("Error deleting profession: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  create,
  getAll,
  updateById,
  deleteById,
};
