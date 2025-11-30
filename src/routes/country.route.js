const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const countryController = require("../controllers/country.controller");
const authMiddleware = require("../middleware/auth");
const {
  create,
  updateById,
  deleteById,
} = require("../validation_schemas/request/basicCRUD");

router
  .route("/")
  .get(authMiddleware.authenticateToken, countryController.getAll)
  .post(
    authMiddleware.authenticateToken,
    validation(create),
    countryController.create
  )
  .put(
    authMiddleware.authenticateToken,
    validation(updateById),
    countryController.updateById
  )
  .delete(
    authMiddleware.authenticateToken,
    validation(deleteById),
    countryController.deleteById
  );

module.exports = router;
