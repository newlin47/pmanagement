const express = require("express");
const app = express.Router();
const { Comment } = require("../db");
module.exports = app;

app.get("/", async (req, res, next) => {
    try {
      const comment = await Comment.findByToken(req.headers.authorization);
      res.send(await comment.getProjects());
    } catch (ex) {
      next(ex);
    }
  });

  app.post("/:id", async (req, res, next) => {
    try {
        const comment = await Comment.create(req.body);
		res.send(comment);
    } catch (ex) {
      next(ex);
    }
  });
  
  app.delete("/:id", async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      comment.destroy();
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  });