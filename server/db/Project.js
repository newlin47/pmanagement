const conn = require('./conn');
const { STRING, UUID, UUIDV4, TEXT } = conn.Sequelize;

const Project = conn.define('project', {
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
});

module.exports = Project;
