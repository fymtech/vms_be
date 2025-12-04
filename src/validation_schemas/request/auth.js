const Joi = require("joi");
const { objectIdValidator } = require("../../helpers/utils");

const adminRegister = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    countryCode: Joi.string().min(3).required(),
    phone: Joi.string().min(9).max(10).required(),
    password: Joi.string().min(8).required(),
    // role: Joi.string().valid("ADMIN").required(),
    deviceType: Joi.number().required(), // 0 for android, 1 for ios, 2 for web
    locale: Joi.string().required(),
    profileImage: Joi.string().allow("").optional(),
  }).required(),
});

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
    userType: Joi.string().valid("admin").required(),
  }).required(),
});

const logout = Joi.object({
  params: Joi.object({
    userType: Joi.string().valid("admin").required(),
  }).required(),
});

module.exports = {
  adminRegister,
  verifyEmail,
  login,
  logout,
};
