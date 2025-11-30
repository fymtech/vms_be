const { status } = require("http-status");

const { responseHandler, errorResponseHandler } = require("../helpers/utils");
const {
  CustomSuccessResponse,
  CustomErrorResponse,
  notFoundResponse,
} = require("../helpers/constants");
const { Clients, Roles } = require("../models");

const register = async (body, userType) => {
  try {
    console.log("Registering user with type:", userType);
    const role = await Roles.findOne({ name: userType });
    if (!role) {
      return responseHandler(
        notFoundResponse("Role/User type"),
        null,
        false,
        status.NOT_FOUND,
        true
      );
    }
    console.log("Registering user with type:", role._id, "in client service");
    const client = await Clients.create({
      ...body,
      role: role._id,
      registeredAt: new Date(),
    });
    console.log("Client registered successfully:", client);
    return responseHandler(CustomSuccessResponse.REGISTERED, null);
  } catch (error) {
    console.error("Error registering client:", error);
    return errorResponseHandler(error);
  }
};

const getAllClients = async () => {
  try {
    const clients = await Clients.find();

    if (!clients || clients.length == 0) {
      return responseHandler(
        notFoundResponse("Clients"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }

    const clientsInfo = admins.map(
      ({ _id: id, firstName, lastName, email, countryCode, phone }) => ({
        id,
        name: `${firstName} ${lastName}`,
        email,
        countryCode,
        phone,
      })
    );

    return responseHandler(CustomSuccessResponse.FETCHED, clientsInfo);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return errorResponseHandler(error);
  }
};

const getClientById = async (clientId) => {
  try {
    const client = await Clients.findById(clientId);
    if (!client)
      return responseHandler(
        notFoundResponse(`Client with id: ${clientId}`),
        null,
        false,
        status.NOT_FOUND,
        true
      );

    const {
      _id: id,
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      profileImage,
    } = admin;
    return responseHandler(CustomSuccessResponse.FETCHED, {
      id,
      name: `${firstName} ${lastName}`,
      email,
      countryCode,
      phone,
      profileImage,
    });
  } catch (error) {
    console.error("Error fetching client info:", error);
    return errorResponseHandler(error);
  }
};

module.exports = {
  register,
  getAllClients,
  getClientById,
};
