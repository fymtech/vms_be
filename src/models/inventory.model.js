const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemModel",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientModel",
      required: true,
    },
    quantity: { type: Number },
    visaProfession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionModel",
    },
    nationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CountryModel",
    },
    embassy: { type: String },
    cost: { type: Number },
    total: { type: Number },
    paidAmount: { type: Number },
    pending: { type: Number }, // Balance
    currency: { type: String },
    visaNumber: { type: String },
    unitedNumber: { type: String },
    establishmentNumber: { type: String },
    comments: { type: String }, // Notes
    modeOfPayment: { type: String, enum: ["Cash", "Card", "Online"] },
    dateOfPayment: { type: Date },
  },
  { timestamps: true, collection: "Inventories" }
);

const Inventories = mongoose.model("InventoryModel", InventorySchema);
module.exports = Inventories;
