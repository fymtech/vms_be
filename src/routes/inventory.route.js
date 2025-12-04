const express = require("express");

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
  .get(authMiddleware.authenticateToken, inventoryController.getAll)
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
