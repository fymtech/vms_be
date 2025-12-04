const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const adminController = require("../controllers/admin.controller");
const { verifyEmail } = require("../validation_schemas/request/auth");
const authMiddleware = require("../middleware/auth");
const Joi = require("joi");
const { objectIdValidator } = require("../helpers/utils");

router.post(
  "/verify/email",
  validation(verifyEmail),
  adminController.verfiyEmail
);

router.get("/", authMiddleware.authenticateToken, adminController.getAllAdmins);

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
  adminController.getAdminById
);

Joi.string().custom(objectIdValidator, "ObjectId validation").required(),
  (module.exports = router);
