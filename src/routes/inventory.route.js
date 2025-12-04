const express = require("express");
const Joi = require("joi");

const router = express.Router();

const validation = require("../middleware/joi");
const inventoryController = require("../controllers/inventory.controller");
const authMiddleware = require("../middleware/auth");
const {
  create,
  updateById,
  deleteById,
  getById,
} = require("../validation_schemas/request/inventory");

router
  .route("/")
  .get(
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
    inventoryController.getAll
  )
  .post(
    authMiddleware.authenticateToken,
    validation(create),
    inventoryController.create
  )
  // .put(
  //   authMiddleware.authenticateToken,
  //   validation(updateById),
  //   inventoryController.updateById
  // )
  .delete(
    authMiddleware.authenticateToken,
    validation(deleteById),
    inventoryController.deleteById
  );

router.get(
  "/:id",
  authMiddleware.authenticateToken,
  validation(getById),
  inventoryController.getById
);

module.exports = router;
