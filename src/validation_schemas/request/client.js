const Joi = require("joi");
const { objectIdValidator } = require("../../helpers/utils");

const clientRegister = Joi.object({
  body: Joi.object({
    firstName: Joi.string().min(3).max(20).required(),
    lastName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    countryCode: Joi.string().min(3).required(),
    phone: Joi.string().min(9).max(10).required(),
    countryId: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    profileImage: Joi.string().allow("").optional(),
  }).required(),
});

module.exports = {
  clientRegister,
};
