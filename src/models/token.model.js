const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerModel",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminModel",
    },
    expired: { type: Boolean, default: false },
    expiredAt: { type: Date },
    revoked: { type: Boolean, default: false },
    revokedAt: { type: Date },
    loggedOut: { type: Boolean, default: false },
    loggedOutAt: { type: Date },
  },
  { timestamps: true, collection: "Tokens" }
);

const Tokens = mongoose.model("TokenModel", TokenSchema);
module.exports = Tokens;
