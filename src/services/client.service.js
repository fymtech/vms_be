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
    console.log("Registering user with role:", role._id, "in client service");
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

const getAllClients = async (page, limit, search) => {
  try {
    const filter = {};

    // Build search filter only when needed
    if (search && search.trim() !== "") {
      const s = search.trim();

      filter.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { phone: { $regex: s, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Query
    const [clients, totalDocuments] = await Promise.all([
      Clients.find(filter).skip(skip).limit(limit).lean(),
      Clients.countDocuments(filter),
    ]);

    /**
     * You can avoid Promise.all, but:
     *  - Sequential await = slower
     *  - Aggregate with $facet = heavier
     *  - Promise.all = fastest & cleanest
     */

    if (!clients || clients.length == 0) {
      return responseHandler(
        notFoundResponse("Clients"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }

    const clientsInfo = clients.map(
      ({ _id: id, name, email, countryCode, phone }) => ({
        id,
        name,
        email,
        countryCode,
        phone,
      })
    );

    const totalPages = Math.ceil(totalDocuments / limit);

    return responseHandler(CustomSuccessResponse.FETCHED, {
      page,
      limit,
      totalDocuments,
      totalPages,
      data: clientsInfo,
    });
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

    const { _id: id, name, email, countryCode, phone, profileImage } = client;
    return responseHandler(CustomSuccessResponse.FETCHED, {
      id,
      name,
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
