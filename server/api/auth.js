const express = require("express");
const app = express.Router();
const { User, Team } = require("../db");

module.exports = app;

app.post("/", async (req, res, next) => {
  try {
    res.send(await User.authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/", async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.post("/create", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.send(user.generateToken());
  } catch (ex) {
    next(ex);
  }
});

app.put("/update", async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    await user.update(req.body);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});
