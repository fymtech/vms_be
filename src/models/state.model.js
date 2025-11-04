const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema(
  {
    countryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CountryModel",
    },
    name: { type: String },
    state_code: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  { collection: "States" }
);

const States = mongoose.model("StateModel", StateSchema);
module.exports = States;
