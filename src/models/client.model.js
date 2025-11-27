const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, maxlength: 20 },
    lastName: { type: String, required: true, maxlength: 20 },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
    countryCode: { type: String, required: true, minlength: 3 },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, "any", {
            strictMode: false,
          });
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: true,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CountryModel",
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StateModel",
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CityModel",
    },
    address: { type: String, maxlength: 255 },
    postalCode: { type: String, required: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoleModel",
      required: true,
    },
    registeredAt: { type: Date, required: true },
    profileImage: { type: String },
    active: { type: Number, required: true, default: 0, enum: [0, 1, 2, 3, 4] }, // 0: pending, 1: active, 2: deactivated, 3: blocked, 4: deleted
    deactivatedAt: { type: Date },
    deactivcatedReason: { type: String, maxlength: 255 },
    blockedAt: { type: Date },
    blockedReason: { type: String, maxlength: 255 },
    deletedAt: { type: Date },
    deletionReason: { type: String, maxlength: 255 },
  },
  { timestamps: true, collection: "Clients" }
);

const Clients = mongoose.model("ClientModel", ClientSchema);
module.exports = Clients;
