const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { commonUserFields } = require("../helpers/constants");

const CustomerSchema = new mongoose.Schema(
  {
    ...commonUserFields,
  },
  { timestamps: true, collection: "Customers" }
);

CustomerSchema.pre("save", async function (next) {
  // eslint-disable-next-line no-invalid-this
  const customer = this;
  if (customer.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(customer.password, salt);
  }
  next();
});

// Method to verify password
CustomerSchema.methods.isValidPassword = async function (password) {
  const customer = this;
  return bcrypt.compare(password, customer.password);
};

const Customers = mongoose.model("CustomerModel", CustomerSchema);
module.exports = Customers;
