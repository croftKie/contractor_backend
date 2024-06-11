const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const loginSchema = new Schema({
  email: String,
  password: String,
  dateCreated: String,
  lastAccessed: String,
});

const Login = model("User", loginSchema);
module.exports = Login;
