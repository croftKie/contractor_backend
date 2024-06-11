const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const Login = require("../models/loginModel");

authRouter.get("/login", async (req, res) => {
  const values = {
    email: req.query.email,
    pass: req.query.pass,
  };

  if (typeof values.email === "string" && typeof values.pass === "string") {
    const user = await Login.where("email").equals(values.email);
    if (user.length === 0) {
      res.send("no user found");
      return;
    }
    if (user.length > 1) {
      res.send("duplicate users found");
      return;
    }

    bcrypt.compare(values.pass, user[0].password, (err, result) => {
      if (result) {
        res.send({
          status: 200,
          result: result,
          message: "login details successful",
        });
      } else {
        res.send({
          status: 400,
          result: result,
          message: "login details in error",
        });
      }
    });
  }
});

authRouter.get("/signup", async (req, res) => {
  const saltRounds = 10;
  const values = {
    email: req.query.email,
    pass: req.query.pass,
    confirm: req.query.confirm,
  };

  if (
    typeof values.email === "string" &&
    typeof values.pass === "string" &&
    typeof values.confirm === "string" &&
    values.pass === values.confirm
  ) {
    const user = await Login.where("email").equals(values.email);
    if (user.length > 0) {
      res.send("user already exists");
      return;
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(values.pass, salt, async (err, hash) => {
        const su = new Login({
          email: values.email,
          password: hash,
          dateCreated: new Date(),
          lastAccessed: new Date(),
        });
        try {
          const result = await su.save();
          res.send({  
            status: 200,
            message: "signup successful",
          });
        } catch (err) {
          res.send(err);
        }
      });
    });
  }
});

module.exports = authRouter;
