const mongoose = require("mongoose");
const Permissions = require("../models/permission.model");

// { name: "CREATE" },
//   { name: "UPDATE" },
//   { name: "DELETE" },
//   { name: "SEND" },
//   { name: "REGISTER" },
const doc = [
  {
    role: "686ba19c6e73724c78843092",
    roleName: "ADMIN",
    resource: "686ba55988b62c2b1e33ab03",
    resourceName: "HOME_PAGE",
    action: "686ba86866f5b68b404cfdc3",
    actionName: "MASTER",
  },
];
(async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hms_db", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB", error);
      });

    // To add data to collection
    const resultDoc_s = await Permissions.create(doc);
    console.log("Document inserted:", resultDoc_s);
  } catch (error) {
    console.error("Error inserting document:", error);
  }
})();
