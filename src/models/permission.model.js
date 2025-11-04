const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoleModel",
      required: true,
    },
    roleName: { type: String, required: true },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceModel",
      required: true,
    },
    resourceName: { type: String, required: true },
    action: {
      type: mongoose.Schema.Types.String,
      ref: "ResourceActionModel",
      required: true,
    },
    actionName: { type: String, required: true },
  },
  { timestamps: true, collection: "Permissions" }
);

const Permissions = mongoose.model("PermissionModel", PermissionSchema);
module.exports = Permissions;
