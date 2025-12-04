const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const settingController = require("../controllers/setting.controller");
const authMiddleware = require("../middleware/auth");
const {
  create,
  updateById,
  deleteById,
} = require("../validation_schemas/request/setting");

router
  .route("/")
  .get(authMiddleware.authenticateToken, settingController.getSettings)
  // .post(
  //   authMiddleware.authenticateToken,
  //   validation(create),
  //   settingController.create
  // )
  .put(
    authMiddleware.authenticateToken,
    validation(updateById),
    settingController.updateById
  );
// .delete(
//   authMiddleware.authenticateToken,
//   validation(deleteById),
//   settingController.deleteById
// );

module.exports = router;
