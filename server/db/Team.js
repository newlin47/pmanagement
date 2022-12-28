const conn = require("./conn");
const { STRING, UUID, UUIDV4 } = conn.Sequelize;

const Team = conn.define("team", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: STRING,
  },
  adminId: {
    type: STRING,
  },
});

module.exports = Team;
