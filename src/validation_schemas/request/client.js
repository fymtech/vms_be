const Joi = require("joi");
const { objectIdValidator } = require("../../helpers/utils");

const clientRegister = Joi.object({
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
    profileImage: Joi.string().allow("").optional(),
  }).required(),
});

module.exports = {
  clientRegister,
};
