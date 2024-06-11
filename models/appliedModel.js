const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const appliedSchema = new Schema({
  user: String,
  jobTitle: String,
  jobLocation: String,
  jobCompany: String,
  jobId: String,
  dateAdded: String,
});

const Applied = model("Applied", appliedSchema);
module.exports = Applied;
