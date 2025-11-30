const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name_en: { type: String, required: true },
    name_ar: { type: String, required: true },
  },
  { timestamps: true, collection: "Items" }
);

const Items = mongoose.model("ItemModel", ItemSchema);
module.exports = Items;
