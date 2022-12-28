const conn = require("./conn");
const { STRING, UUID, UUIDV4, TEXT, ENUM, DATE } = conn.Sequelize;

const Task = conn.define("task", {
	id: {
		type: UUID,
		primaryKey: true,
		defaultValue: UUIDV4,
	},
	name: {
		type: STRING,
	},
	description: {
		type: TEXT,
	},
	status: {
		type: ENUM("Backlog", "To Do", "In Progress", "Done"),
		defaultValue: "To Do",
	},
	deadline: {
		type: DATE,
	},
});

module.exports = Task;
