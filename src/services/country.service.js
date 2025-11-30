const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { Countries } = require("../models");

const create = async (body) => {
  try {
    const country = await Countries.create(body);
    console.log("Country created successfully:", country);
    return responseHandler(CustomSuccessResponse.CREATED, null);
  } catch (error) {
    console.error("Error creating country:", error);
    return errorResponseHandler(error);
  }
};

const getAll = async () => {
  try {
    const countries = await Countries.find();
    if (!countries || countries.length == 0) {
      return responseHandler(
        notFoundResponse("Countries"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }
    return responseHandler(CustomSuccessResponse.FETCHED, countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return errorResponseHandler(error);
  }
};

const updateById = async (body) => {
  try {
    const { id, ...updateBody } = body;
    const country = await Countries.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true, runValidators: true }
    );
    if (!country)
      return responseHandler(
        notFoundResponse(`Country with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.UPDATED, country);
  } catch (error) {
    console.error("Error updating country: ", error);
    return errorResponseHandler(error);
  }
};

const deleteById = async (id) => {
  try {
    const country = await Countries.findByIdAndDelete(id);
    if (!country)
      return responseHandler(
        notFoundResponse(`Country with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.DELETED, null);
  } catch (error) {
    console.error("Error deleting country: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  create,
  getAll,
  updateById,
  deleteById,
};
