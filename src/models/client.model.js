const mongoose = require("mongoose");
const validator = require("validator");

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
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
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoleModel",
      required: true,
    },
    registeredAt: { type: Date, required: true },
    profileImage: { type: String },
  },
  { timestamps: true, collection: "Clients" }
);

const Clients = mongoose.model("ClientModel", ClientSchema);
module.exports = Clients;
