const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    isoCode: { type: String, unique: true },
    capital: { type: String },
    currency: { type: String },
    currency_symbol: { type: String },
    timezones: [
      {
        zoneName: { type: String },
        gmtOffset: { type: Number },
        gmtOffsetName: { type: String },
        abbreviation: { type: String },
        tzName: { type: String },
      },
    ],
    latitude: { type: String },
    longitude: { type: String },
  },
  { collection: "Countries" }
);

const Countries = mongoose.model("CountryModel", CountrySchema);
module.exports = Countries;
