const express = require("express");
// const path = require("path");
const cors = require("cors");

require("dotenv").config();

const db = require("./db");
const routes = require("./routes");
const swaggerDocs = require("./swagger");

const app = express();

// Initialize the database connection
db();

// Initialize Swagger documentation
swaggerDocs(app);

// Serve static files from the 'assets' directory
// app.use(express.static(path.join(__dirname, "assets")));

// parse json request body
// This is necessary for APIs that accept JSON data. It allows the server to parse JSON payloads in incoming requests
app.use(express.json());

// parse urlencoded request body
/* This is necessary for form submissions and URL-encoded data
 * It allows the server to parse data sent in the body of a request
 * with the 'application/x-www-form-urlencoded' content type
 * The 'extended: true' option allows for rich objects and arrays to be encoded
 * into the URL-encoded format, using the qs library
 * If set to false, the querystring library is used instead, which does not support nested
 * objects and arrays
 */
app.use(express.urlencoded({ extended: true }));

// Middleware function to log request and response information
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log(
      `Response sent for ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`
    );
    console.log("Response Body:", body);
    originalSend.call(this, body);
  };
  console.log(`Request received - ${req.method} ${req.originalUrl}`);
  next();
});

// Enable CORS (Cross-Origin Resource Sharing)
/**
 * CORS is a security feature that allows or restricts resources on a web page to be requested from another domain outside
 * the domain from which the first resource was served. This middleware enables CORS for all routes, allowing requests from any origin.
 * In a production environment, you might want to restrict this to specific origins for security reasons.
 * For example, you can configure it to allow only requests from your frontend application.
 * Example: app.use(cors({ origin: 'https://your-frontend-domain.com' }));
 * This is useful for APIs that need to be accessed by web applications hosted on different domains.
 * It allows the server to handle requests from different origins, which is common in modern web applications
 * where the frontend and backend are hosted on different domains or ports.
 * In development, it is often set to allow all origins for ease of testing.
 * In production, you should restrict it to specific origins for security reasons.
 * Example: app.use(cors({ origin: 'https://your-frontend-domain.com' }));
 */
app.use(cors());
// app.options("*", cors());

app.use("", routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
