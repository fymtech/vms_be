const express = require("express");
const { status } = require("http-status");

const router = express.Router();

// Import routes
const authRoutes = require("./auth.route");
const adminRoutes = require("./admin.route");
const customerRoutes = require("./customer.route");

const defaultRoutes = [
  {
    path: "/api/auth",
    route: authRoutes,
  },
  {
    path: "/api/admin",
    route: adminRoutes,
  },
  {
    path: "/api/customer",
    route: customerRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// For handling undefined routes
// router.all("*", (req, res) => {
router.use((req, res) => {
  res.status(status.NOT_FOUND).json({
    message: "Route: " + req.url + "; not found.",
    data: null,
    status: false,
    httpStatus: status.NOT_FOUND,
    isError: true,
  });
});

module.exports = router;
