const mongoose = require("mongoose");
const validator = require("validator");

const RoleType = {
  RENTER: 1,
  CUSTOMER: 2,
};

const notFoundResponse = (entity) => {
  // return `${entity.charAt(0).toUpperCase() + entity.slice(1)} not found.`
  return `${entity} not found.`;
};

const CustomErrorResponse = {
  NO_TOKEN_PROVIDED: "Access Denied. No token provided.",
  INCORRECT_PASSWORD: "Password is incorrect.",
  USER_DATA_REQUIRED: "User data is required.",
  INVALID_USER_TYPE: "Invalid user type.",
  INVALID_TOKEN: "Invalid token.",
  CANNOT_CREATE_SUPER_BUSINESS:
    "Can not create super business. A super business already exist.",
  DELETE_SUPER_USER:
    "This is a Super user. Other super users not found in business. So not deleting this user",
  DELETE_SUPER_BUSINESS:
    "Cannot delete business. You will delete yourself and all your data. Please check with the developer if you want to go ahead with this.",
};

const CustomSuccessResponse = {
  CREATED: "Created successfully",
  REGISTERED: "Registered successfully",
  FETCHED: "Fetched successfully",
  UPDATED: "Updated Successfully",
  DELETED: "Deleted Successfully",
  UPLOADED: "Uploaded Successfully",
  SENT: "Sent Successfully",
  VERIFIED: "Verified Successfully",
  ALREADY_VERIFIED: "Already verified",
  USER_LOGIN_SUCCESS: "User successfully logged in.",
  USER_LOGOUT_SUCCESS: "User Successfully logged out.",
};

const URLPaths = {
  EMAIL_VERIFY: "/verify/email?email=",
};

const commonUserFields = {
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
  password: { type: String, required: true, minlength: 8, private: true },
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
  deviceType: { type: Number, enum: [0, 1, 2] }, // 0 for android, 1 for ios, 2 for web
  locale: { type: String, default: "en" },
  profileImage: { type: String },
  referralCode: { type: String },
  registeredAt: { type: Date, required: true },
  status: { type: Number, required: true, enum: [0, 1] }, // 0: offline, 1: online
  loggedInAt: { type: Date },
  loggedOutAt: { type: Date },
  active: { type: Number, required: true, default: 0, enum: [0, 1, 2] }, // 0: deactivated, 1: active, 2: blocked
  isEmailVerified: { type: Number, required: true, default: 0 },
  emailVerifiedAt: { type: Date },
  isPhoneVerified: { type: Number, required: true, default: 0 },
  phoneVerifiedAt: { type: Date },
  lat: { type: String },
  lng: { type: String },
  fcmToken: { type: String },
  deactivatedAt: { type: Date },
  deactivcatedReason: { type: String, maxlength: 255 },
  blockedAt: { type: Date },
  blockedReason: { type: String, maxlength: 255 },
  walletBalance: { type: Number, required: true, default: 0.0 },
};

module.exports = {
  RoleType,
  CustomErrorResponse,
  CustomSuccessResponse,
  URLPaths,
  notFoundResponse,
  commonUserFields,
};
