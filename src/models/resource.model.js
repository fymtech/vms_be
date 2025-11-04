const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["HOME_PAGE", "CATALOG", "CUSTOMER", "CHAT", "TICKETS"],
    },
  },
  { timestamps: true, collection: "Resources" }
);

const Resources = mongoose.model("ResourceModel", ResourceSchema);
module.exports = Resources;
