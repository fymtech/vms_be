const Joi = require("joi");
const { objectIdValidator } = require("../../helpers/utils");

const create = Joi.object({
  body: Joi.object({
    rows_per_page: Joi.string().required(),
    ui_theme: Joi.string().valid("dark", "light").required(),
  }).required(),
});

const updateById = Joi.object({
  body: Joi.object({
    id: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    rows_per_page: Joi.string().optional(),
    ui_theme: Joi.string().optional(),
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
