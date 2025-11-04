const mongoose = require("mongoose");

const ResourceActionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "READ",
        "CREATE",
        "UPDATE",
        "DELETE",
        "SEND",
        "REGISTER",
        "MASTER",
      ],
    },
  },
  { timestamps: true, collection: "ResourceActions" }
);

const ResourceActions = mongoose.model(
  "ResourceActionModel",
  ResourceActionSchema
);
module.exports = ResourceActions;
