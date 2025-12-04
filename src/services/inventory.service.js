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

const getAll = async (page, limit, search) => {
  try {
    // sanitize/normalize inputs (optional if validated earlier)
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;

    // helper to escape regex special chars in user input
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex =
      search && search.trim() !== ""
        ? new RegExp(escapeRegExp(search.trim()), "i")
        : null;

    // Build aggregation pipeline
    const pipeline = [];

    // 1) Lookups to join referenced collections (like populate)
    pipeline.push(
      {
        $lookup: {
          from: "items", // collection name for ItemModel
          localField: "item",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "clients", // collection name for ClientModel
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "professions", // collection name for ProfessionModel
          localField: "visaProfession",
          foreignField: "_id",
          as: "visaProfession",
        },
      },
      {
        $unwind: { path: "$visaProfession", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "countries", // collection name for CountryModel
          localField: "nationality",
          foreignField: "_id",
          as: "nationality",
        },
      },
      { $unwind: { path: "$nationality", preserveNullAndEmptyArrays: true } }
    );

    // 2) Optional search stage (against inventory fields and joined fields)
    if (searchRegex) {
      pipeline.push({
        $match: {
          $or: [
            // inventory fields
            { embassy: searchRegex },
            { visaNumber: searchRegex },
            { unitedNumber: searchRegex },
            { establishmentNumber: searchRegex },
            { comments: searchRegex },
            { modeOfPayment: searchRegex },

            // item fields
            { "item.name_en": searchRegex },
            { "item.name_ar": searchRegex },

            // client fields
            { "client.name": searchRegex },
            { "client.phone": searchRegex },

            // profession fields
            { "visaProfession.name_en": searchRegex },
            { "visaProfession.name_ar": searchRegex },

            // nationality fields
            { "nationality.name_en": searchRegex },
            { "nationality.name_ar": searchRegex },
          ],
        },
      });
    }

    // 3) Pagination and total using $facet
    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } }, // optional: sort newest first
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              // select fields you want in the response
              _id: 1,
              item: {
                _id: "$item._id",
                name_en: "$item.name_en",
                name_ar: "$item.name_ar",
              },
              client: {
                _id: "$client._id",
                name: "$client.name",
                email: "$client.email",
                phone: "$client.phone",
                countryCode: "$client.countryCode",
              },
              visaProfession: {
                _id: "$visaProfession._id",
                name_en: "$visaProfession.name_en",
                name_ar: "$visaProfession.name_ar",
              },
              nationality: {
                _id: "$nationality._id",
                name_en: "$nationality.name_en",
                name_ar: "$nationality.name_ar",
              },
              quantity: 1,
              embassy: 1,
              cost: 1,
              total: 1,
              paidAmount: 1,
              pending: 1,
              currency: 1,
              visaNumber: 1,
              unitedNumber: 1,
              establishmentNumber: 1,
              comments: 1,
              modeOfPayment: 1,
              dateOfPayment: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    // Execute pipeline
    const aggResult = await Inventories.aggregate(pipeline).exec();
    const inventories = aggResult[0]?.data || [];
    const totalDocuments = aggResult[0]?.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(totalDocuments / limit) || 0;

    // If you want to return NOT_FOUND when empty (as your previous code did)
    if (!inventories || inventories.length === 0) {
      return responseHandler(
        notFoundResponse("Inventories"),
        [],
        false,
        status.NOT_FOUND,
        true
      );
    }

    // Otherwise return success payload
    return responseHandler(CustomSuccessResponse.FETCHED, {
      page,
      limit,
      totalDocuments,
      totalPages,
      data: inventories,
    });
  } catch (error) {
    console.error("Error fetching inventories (aggregate):", error);
    return errorResponseHandler(error);
  }
};

const getById = async (id) => {
  try {
    const inventory = await Inventories.findById(id)
      .populate([
        { path: "item", select: "_id name_en name_ar" },
        { path: "client", select: "_id name email phone countryCode" },
        { path: "visaProfession", select: "_id name_en name_ar" },
        { path: "nationality", select: "_id name_en name_ar" },
      ])
      .lean();

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
