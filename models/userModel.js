const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    nullAllowed: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  mail: {
    type: Sequelize.STRING,
    nullAllowed: false,
    unique: true,
  },
  phoneno: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  password: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  careerGoal: {
    type: Sequelize.STRING,
    nullAllowed: true,
  },
});
module.exports = User;
