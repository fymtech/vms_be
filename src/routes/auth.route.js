const express = require("express");

const router = express.Router();

const validation = require("../middleware/joi");
const authMiddleware = require("../middleware/auth");
const authController = require("../controllers/auth.controller");
const {
  adminRegister,
  login,
  logout,
} = require("../validation_schemas/request/auth");

[
  // { path: "/register/customer", schema: customerRegister },
  { path: "/register/admin", schema: adminRegister },
].forEach(({ path, schema }) => {
  router.post(path, validation(schema), authController.register);
});

router.post("/:userType/login", validation(login), authController.login);

router.post(
  "/:userType/logout",
  validation(logout),
  authMiddleware.authenticateToken,
  authController.logout
);

module.exports = router;
