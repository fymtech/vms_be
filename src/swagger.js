const path = require("path");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const basicAuth = require("express-basic-auth");

function swaggerDocs(app) {
  const swaggerDocsPath = path.join(__dirname, "./swagger_docs");
  let swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Visa and Iqama Management System API",
      version: "1.0.0",
      description:
        "API documentation for the Visa and Iqama Management System Project",
    },
    servers: [
      {
        url: "https://vms-be-9drd.onrender.com",
        description: "Render server",
      },
      {
        url: "http://localhost:3334",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {},
  };

  const files = fs.readdirSync(swaggerDocsPath);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  jsonFiles.forEach((file) => {
    const filePath = path.join(swaggerDocsPath, file);
    const routeDoc = JSON.parse(fs.readFileSync(filePath, "utf8"));
    swaggerDocument.paths = { ...swaggerDocument.paths, ...routeDoc.paths };
  });

  app.use(
    "/api-docs",
    basicAuth({
      users: { fymtech: "FYmTech@2025!?" },
      challenge: true,
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
}

module.exports = swaggerDocs;
