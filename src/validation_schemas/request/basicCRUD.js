const Joi = require("joi");
const { objectIdValidator } = require("../../helpers/utils");

const create = Joi.object({
  body: Joi.object({
    name_en: Joi.string().required(),
    name_ar: Joi.string().required(),
  }).required(),
});

const updateById = Joi.object({
  body: Joi.object({
    id: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    name_en: Joi.string().optional(),
    name_ar: Joi.string().optional(),
  }).required(),
});

const deleteById = Joi.object({
  body: Joi.object({
    id: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
  }).required(),
});

module.exports = {
  create,
  updateById,
  deleteById,
};
