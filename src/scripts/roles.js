const mongoose = require("mongoose");
const Roles = require("../models/role.model");

const doc = [{ name: "ADMIN" }, { name: "CLIENT" }];
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
    const resultDoc_s = await Roles.create(doc);
    console.log("Document inserted:", resultDoc_s);
  } catch (error) {
    console.error("Error inserting document:", error);
  }
})();
