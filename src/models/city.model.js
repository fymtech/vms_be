const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    countryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CountryModel",
    },
    stateRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StateModel",
    },
    name: { type: String, required: true },
    latitude: { type: String },
    longitude: { type: String },
  },
  { collection: "Cities" }
);

const Cities = mongoose.model("CityModel", CitySchema);
module.exports = Cities;
