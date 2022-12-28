const express = require("express");
const app = express.Router();
const { User, Task } = require("../db");

app.get("/", async (req, res, next) => {
	try {
		const user = await User.findByToken(req.headers.authorization);
		res.send(await user.getTasks());
	} catch (ex) {
		next(ex);
	}
});

app.post("/create", async (req, res, next) => {
	try {
		const task = await Task.create(req.body);
		res.send(task);
	} catch (ex) {
		next(ex);
	}
});

app.put("/:id", async (req, res, next) => {
	try {
		const task = await Task.findByPk(req.params.id);
		await task.update(req.body);
		await task.save();
		res.send(task);
	} catch (ex) {
		next(ex);
	}
});

app.delete("/:id", async (req, res, next) => {
	try {
		const task = await Task.findByPk(req.params.id);
		await task.destroy();
		res.sendStatus(204);
	} catch (ex) {
		next(ex);
	}
});

module.exports = app;
