const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { commonUserFields } = require("../helpers/constants");

const AdminSchema = new mongoose.Schema(
  {
    ...commonUserFields,
    // Additional fields specific to Admins can be added here
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
