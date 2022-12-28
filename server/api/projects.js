const express = require("express");
const app = express.Router();
const { Project, Task, User, Log } = require("../db");
module.exports = app;

app.get("/", async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization);
    res.send(await user.getProjects());
  } catch (ex) {
    next(ex);
  }
});

app.post("/create", async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.send(project);
  } catch (ex) {
    next(ex);
  }
});

app.put("/:id", async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    await project.update({
      name: req.body.name,
      description: req.body.description,
    });
    await project.save();
    res.send(project);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    project.destroy();
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.get("/log/:id", async (req, res, next) => {
  try {
    res.send(
      await Log.findAll({
        where: {
          projectId: req.params.id,
        },
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.post("/addlog", async (req, res, next) => {
  try {
    const newLogItem = await Log.create(req.body);
    res.send(newLogItem);
  } catch (ex) {
    next(ex);
  }
});

module.exports = app;
