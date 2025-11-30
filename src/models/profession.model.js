const mongoose = require("mongoose");

const ProfessionSchema = new mongoose.Schema(
  {
    name_en: { type: String, required: true },
    name_ar: { type: String, required: true },
  },
  { timestamps: true, collection: "Professions" }
);

const Professions = mongoose.model("ProfessionModel", ProfessionSchema);
module.exports = Professions;
