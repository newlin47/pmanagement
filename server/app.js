const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
require("dotenv").config();

app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use("/static", express.static(path.join(__dirname, "../static")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../static/index.html"))
);

app.use("/api/emails", require("./api/emails"));
app.use("/api/auth", require("./api/auth"));
app.use("/api/teams", require("./api/teams"));
app.use("/api/users", require("./api/users"));
app.use("/api/projects", require("./api/projects"));
app.use("/api/tasks", require("./api/tasks"));
app.use("/api/posts", require("./api/posts"));

module.exports = app;
