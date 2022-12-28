const conn = require("./conn");
const { STRING, UUID, UUIDV4 } = conn.Sequelize;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;

const User = conn.define("user", {
	id: {
		type: UUID,
		primaryKey: true,
		defaultValue: UUIDV4,
	},
	username: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
		unique: true,
	},
	password: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	firstName: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	lastName: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	email: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			isEmail: true,
		},
	},
});

User.addHook("beforeSave", async (user) => {
	if (user.changed("password")) {
		user.password = await bcrypt.hash(user.password, 5);
	}
});

User.findByToken = async function (token) {
	try {
		const { id } = jwt.verify(token, process.env.JWT);
		const user = await this.findByPk(id);
		if (user) {
			return user;
		}
		throw "user not found";
	} catch (ex) {
		const error = new Error("bad credentials");
		error.status = 401;
		throw error;
	}
};

User.prototype.generateToken = function () {
	return jwt.sign({ id: this.id }, JWT);
};

User.authenticate = async function ({ username, password }) {
	const user = await this.findOne({
		where: {
			username,
		},
	});
	if (user && (await bcrypt.compare(password, user.password))) {
		return jwt.sign({ id: user.id }, JWT);
	}
	const error = new Error("bad credentials");
	error.status = 401;
	throw error;
};

User.prototype.getProjects = async function () {
	let projects = await conn.models.project.findAll({
		where: {
			teamId: this.teamId,
		},
		include: [{ model: conn.models.task }],
	});
	return projects;
};

User.prototype.getTasks = async function () {
	let tasks = await conn.models.task.findAll({
		where: {
			teamId: this.teamId,
		},
	});
	return tasks;
};

module.exports = User;
