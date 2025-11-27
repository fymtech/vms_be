const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const adminController = require("../controllers/admin.controller");
const { verifyEmail } = require("../validation_schemas/request/auth");

router.post(
  "/verify/email",
  validation(verifyEmail),
  adminController.verfiyEmail
);

router.get("/", adminController.getAllAdmins);

module.exports = router;
