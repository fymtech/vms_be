const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { Items } = require("../models");

const create = async (body) => {
  try {
    const item = await Items.create(body);
    console.log("Item creates successfully:", item);
    return responseHandler(CustomSuccessResponse.CREATED, null);
  } catch (error) {
    console.error("Error creating item:", error);
    return errorResponseHandler(error);
  }
};

const getAll = async () => {
  try {
    const items = await Items.find();
    if (!items || items.length == 0) {
      return responseHandler(
        notFoundResponse("Items"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }
    return responseHandler(CustomSuccessResponse.FETCHED, items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return errorResponseHandler(error);
  }
};

const updateById = async (body) => {
  try {
    const { id, ...updateBody } = body;
    const item = await Items.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true, runValidators: true }
    );
    if (!item)
      return responseHandler(
        notFoundResponse(`Item with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.UPDATED, item);
  } catch (error) {
    console.error("Error updating item: ", error);
    return errorResponseHandler(error);
  }
};

const deleteById = async (id) => {
  try {
    const item = await Items.findByIdAndDelete(id);
    if (!item)
      return responseHandler(
        notFoundResponse(`Item with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.DELETED, null);
  } catch (error) {
    console.error("Error deleting item: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  create,
  getAll,
  updateById,
  deleteById,
};
