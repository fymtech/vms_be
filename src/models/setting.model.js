const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema(
  {
    rows_per_page: { type: Number },
    ui_theme: { type: String, enum: ["light", "dark"] },
  },
  { timestamps: true, collection: "Settings" }
);

const Settings = mongoose.model("SettingModel", SettingSchema);
module.exports = Settings;
