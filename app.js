require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const cors = require("cors");

const app = express();
const port = process.env.PORT | 3000;
// var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
//   flags: "a",
// });

app.use(cors());

// logger middleware
app.use((req, res, next) => {
  req.time = new Date(Date.now()).toString();
  console.log(req.method, req.hostname, req.path, req.time);
  next();
});
// app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log("listening on port:" + port);
});
