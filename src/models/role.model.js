const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["CUSTOMER", "ADMIN", "SUPPORT"],
    },
  },
  { timestamps: true, collection: "Roles" }
);

const Roles = mongoose.model("RoleModel", RoleSchema);
module.exports = Roles;
