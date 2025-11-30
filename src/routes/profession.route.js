const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const professionController = require("../controllers/profession.controller");
const authMiddleware = require("../middleware/auth");
const {
  create,
  updateById,
  deleteById,
} = require("../validation_schemas/request/basicCRUD");

router
  .route("/")
  .get(authMiddleware.authenticateToken, professionController.getAll)
  .post(
    authMiddleware.authenticateToken,
    validation(create),
    professionController.create
  )
  .put(
    authMiddleware.authenticateToken,
    validation(updateById),
    professionController.updateById
  )
  .delete(
    authMiddleware.authenticateToken,
    validation(deleteById),
    professionController.deleteById
  );

module.exports = router;
