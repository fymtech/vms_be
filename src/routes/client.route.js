const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const clientController = require("../controllers/client.controller");
const authMiddleware = require("../middleware/auth");
const { clientRegister } = require("../validation_schemas/request/client");

router.post(
  "/register",
  authMiddleware.authenticateToken,
  validation(clientRegister),
  clientController.register
);

router.get(
  "/",
  authMiddleware.authenticateToken,
  clientController.getAllClients
);

router.get(
  "/:id",
  authMiddleware.authenticateToken,
  clientController.getClientById
);

module.exports = router;
