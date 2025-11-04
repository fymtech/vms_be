const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const authMiddleware = require("../middleware/auth");
const customerController = require("../controllers/customer.controller");
const { verifyEmail } = require("../validation_schemas/request/auth");

router.post(
  "/verify/email",
  validation(verifyEmail),
  customerController.verfiyEmail
);

router.get(
  "/home-page",
  authMiddleware.authenticateToken,
  authMiddleware.checkUserType,
  customerController.getHomePage
);

module.exports = router;
