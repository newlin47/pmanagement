const express = require("express");
const app = express.Router();
const { User, Team } = require("../db");
module.exports = app;

app.get("/", async (req, res, next) => {
  try {
    res.send(
      await User.findAll({
        include: [{ model: Team, include: [{ model: User }] }],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.delete('/:id', async(req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    await user.destroy()
    res.sendStatus(204)
  }
  catch(ex) {
    next(ex)
  }
})
