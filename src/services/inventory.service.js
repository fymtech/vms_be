const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { Inventories, Items, Clients } = require("../models");

const create = async (body, itemId, clientId, professionId, countryId) => {
  try {
    const item = await Items.findById(itemId);
    if (!item)
      return responseHandler(
        notFoundResponse(`Item with id: ${itemId}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    const client = await Clients.findById(clientId);
    if (!client)
      return responseHandler(
        notFoundResponse(`Client with id: ${clientId}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    const profession = await Professions.findById(professionId);
    if (!profession)
      return responseHandler(
        notFoundResponse(`Profession with id: ${professionId}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    const country = await Countries.findById(countryId);
    if (!country)
      return responseHandler(
        notFoundResponse(`Country with id: ${countryId}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    body.item = item;
    body.client = client;
    body.visaProfession = profession;
    body.nationality = country;
    const inventory = await Inventories.create(body);
    console.log("Inventory creates successfully:", inventory);
    return responseHandler(CustomSuccessResponse.CREATED, null);
  } catch (error) {
    console.error("Error creating inventory:", error);
    return errorResponseHandler(error);
  }
};

const getAll = async () => {
  try {
    const inventories = await Inventories.find();
    if (!inventories || inventories.length == 0) {
      return responseHandler(
        notFoundResponse("Inventories"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }
    return responseHandler(CustomSuccessResponse.FETCHED, inventories);
  } catch (error) {
    console.error("Error fetching inventories:", error);
    return errorResponseHandler(error);
  }
};

const getById = async (id) => {
  try {
    const inventory = await Inventories.findById(id);
    if (!inventory) {
      return responseHandler(
        notFoundResponse("Inventory"),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    }
    return responseHandler(CustomSuccessResponse.FETCHED, inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return errorResponseHandler(error);
  }
};

const updateById = async (body) => {
  try {
    const { id, ...updateBody } = body;
    const inventory = await Inventories.findByIdAndUpdate(
      id,
      { $set: updateBody },
      { new: true, runValidators: true }
    );
    if (!inventory)
      return responseHandler(
        notFoundResponse(`Inventory with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.UPDATED, inventory);
  } catch (error) {
    console.error("Error updating inventory: ", error);
    return errorResponseHandler(error);
  }
};

const deleteById = async (id) => {
  try {
    const inventory = await Inventories.findByIdAndDelete(id);
    if (!inventory)
      return responseHandler(
        notFoundResponse(`Inventory with id: ${id}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    return responseHandler(CustomSuccessResponse.DELETED, null);
  } catch (error) {
    console.error("Error deleting inventory: ", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
