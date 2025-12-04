const express = require("express");
const Joi = require("joi");

const router = express.Router();

const validation = require("../middleware/joi");
const clientController = require("../controllers/client.controller");
const authMiddleware = require("../middleware/auth");
const { clientRegister } = require("../validation_schemas/request/client");
const { objectIdValidator } = require("../helpers/utils");

router.post(
  "/register",
  authMiddleware.authenticateToken,
  validation(clientRegister),
  clientController.register
);

router.get(
  "/",
  authMiddleware.authenticateToken,
  validation(
    Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).default(1).required(),
        limit: Joi.number().integer().min(1).max(100).default(10).required(),
        search: Joi.string().allow("").optional(),
      }),
    }).required()
  ),
  clientController.getAllClients
);

router.get(
  "/:id",
  authMiddleware.authenticateToken,
  validation({
    params: Joi.object({
      id: Joi.string()
        .custom(objectIdValidator, "ObjectId validation")
        .required(),
    }).required(),
  }),
  clientController.getClientById
);

module.exports = router;
