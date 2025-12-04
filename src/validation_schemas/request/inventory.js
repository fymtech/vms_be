const Joi = require("joi");
const { objectIdValidator } = require("../../helpers/utils");

const create = Joi.object({
  body: Joi.object({
    item: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    client: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    visaProfession: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .optional(),
    nationality: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .optional(),
    quanity: Joi.number().optional(),
    embassy: Joi.string().optional(),
    cost: Joi.number().optional(), // This is cost per unit
    total: Joi.number().optional(), // All amounts in Saudi Riyal
    paidAmount: Joi.number().optional(),
    pending: Joi.number().optional(),
    currency: Joi.string().optional(),
    visaNumber: Joi.string().optional(),
    unitedNumber: Joi.string().optional(),
    establishmentNumber: Joi.string().optional(),
    comments: Joi.string().optional(),
    modeOfPayment: Joi.string().valid("Cash", "Card", "Online").optional(),
    dateOfPayment: Joi.date().optional(),
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

const getById = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
  }).required(),
});

module.exports = {
  create,
  updateById,
  deleteById,
  getById,
};
