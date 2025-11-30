const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const itemController = require("../controllers/item.controller");
const authMiddleware = require("../middleware/auth");
const {
  create,
  updateById,
  deleteById,
} = require("../validation_schemas/request/basicCRUD");

router
  .route("/")
  .get(authMiddleware.authenticateToken, itemController.getAll)
  .post(
    authMiddleware.authenticateToken,
    validation(create),
    itemController.create
  )
  .put(
    authMiddleware.authenticateToken,
    validation(updateById),
    itemController.updateById
  )
  .delete(
    authMiddleware.authenticateToken,
    validation(deleteById),
    itemController.deleteById
  );

module.exports = router;
