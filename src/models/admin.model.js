const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const AdminSchema = new mongoose.Schema(
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
    password: { type: String, required: true, minlength: 8, private: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoleModel",
      required: true,
    },
    deviceType: { type: Number, enum: [0, 1, 2] }, // 0 for android, 1 for ios, 2 for web
    locale: { type: String, default: "en" },
    profileImage: { type: String },
    registeredAt: { type: Date, required: true },
    status: { type: Number, required: true, enum: [0, 1] }, // 0: offline, 1: online
    loggedInAt: { type: Date },
    loggedOutAt: { type: Date },
    isEmailVerified: { type: Number, required: true, default: 0 },
    emailVerifiedAt: { type: Date },
    isPhoneVerified: { type: Number, required: true, default: 0 },
    phoneVerifiedAt: { type: Date },
  },
  { timestamps: true, collection: "Admins" }
);

AdminSchema.pre("save", async function (next) {
  // eslint-disable-next-line no-invalid-this
  const admin = this;
  if (admin.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
  next();
});

// Method to verify password
AdminSchema.methods.isValidPassword = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

const Admins = mongoose.model("AdminModel", AdminSchema);
module.exports = Admins;
