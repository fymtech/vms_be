const Joi = require("joi");
const { objectIdValidator } = require("../../helpers/utils");

const customerRegister = Joi.object({
  body: Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().required().valid("MALE", "FEMALE"),
    countryCode: Joi.string().min(3).required(),
    phone: Joi.string().min(9).max(10).required(),
    password: Joi.string().min(8).required(),
    countryId: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    stateId: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    cityId: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    address: Joi.string().max(255).required(),
    postalCode: Joi.string().required(),
    role: Joi.string().valid("CUSTOMER").required(),
    deviceType: Joi.number().required(), // 0 for android, 1 for ios, 2 for web
    locale: Joi.string().required(),
    profileImage: Joi.string(),
    referralCode: Joi.string(),
  }).required(),
  // params: Joi.object({
  //   userType: Joi.string().valid("customer").required(),
  // }).required(),
});

const adminRegister = Joi.object({
  body: Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    gender: Joi.string().required().valid("MALE", "FEMALE"),
    countryCode: Joi.string().min(3).required(),
    phone: Joi.string().min(9).max(10).required(),
    password: Joi.string().min(8).required(),
    countryId: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    stateId: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    cityId: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    address: Joi.string().max(255).required(),
    postalCode: Joi.string().required(),
    role: Joi.string().valid("ADMIN").required(),
    deviceType: Joi.number().required(), // 0 for android, 1 for ios, 2 for web
    locale: Joi.string().required(),
    profileImage: Joi.string(),
    referralCode: Joi.string(),
  }).required(),
  // params: Joi.object({
  //   userType: Joi.string().valid("admin").required(),
  // }).required(),
});

// const updateCustomer = Joi.object({
//   body: Joi.object({
//     id: Joi.string()
//       .custom(objectIdValidator, "ObjectId validation")
//       .required(),
//     firstName: Joi.string().min(3).max(20),
//     lastName: Joi.string().min(3).max(20),
//     email: Joi.string().email(),
//     countryCode: Joi.string().min(4),
//     phone: Joi.string().min(9).max(10),
//   }).required(),
// });

// const updateCustomerBillingAddress = Joi.object({
//   params: Joi.object({
//     customerId: Joi.string()
//       .custom(objectIdValidator, "ObjectId validation")
//       .required(),
//   }).required(),
//   body: Joi.object({
//     countryRef: Joi.string().custom(objectIdValidator, "ObjectId validation"),
//     stateRef: Joi.string().custom(objectIdValidator, "ObjectId validation"),
//     cityRef: Joi.string().custom(objectIdValidator, "ObjectId validation"),
//     address: Joi.string().max(255),
//     postalAddress: Joi.string(),
//   }).required(),
// });

const verifyEmail = Joi.object({
  query: Joi.object({
    email: Joi.string().email().required(),
  }).required(),
});

const login = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    deviceType: Joi.number().required(), // 0 for android, 1 for ios, 2 for web
  }).required(),
  params: Joi.object({
    userType: Joi.string().valid("customer", "admin").required(),
  }).required(),
});

const logout = Joi.object({
  params: Joi.object({
    userType: Joi.string().valid("customer", "admin").required(),
  }).required(),
});

module.exports = {
  customerRegister,
  adminRegister,
  verifyEmail,
  login,
  logout,
};
