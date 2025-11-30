const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const adminController = require("../controllers/admin.controller");
const { verifyEmail } = require("../validation_schemas/request/auth");
const authMiddleware = require("../middleware/auth");

router.post(
  "/verify/email",
  validation(verifyEmail),
  adminController.verfiyEmail
);

router.get("/", authMiddleware.authenticateToken, adminController.getAllAdmins);

router.get(
  "/:id",
  authMiddleware.authenticateToken,
  adminController.getAdminById
);

module.exports = router;
