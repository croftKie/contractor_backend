const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const favouritesSchema = new Schema({
  user: String,
  jobTitle: String,
  jobLocation: String,
  jobCompany: String,
  jobId: String,
  dateAdded: String,
});

const Favourite = model("Favourite", favouritesSchema);
module.exports = Favourite;
