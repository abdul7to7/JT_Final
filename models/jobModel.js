const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const Job = sequelize.define("jt_job", {
  id: {
    type: Sequelize.INTEGER,
    nullAllowed: false,
    primaryKey: true,
    autoIncrement: true,
  },
  position: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  company: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  maxSalary: {
    type: Sequelize.INTEGER,
  },
  location: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.ENUM(
      "bookmarked",
      "applied",
      "interviewing",
      "offered",
      "negotiating",
      "accepted"
    ),
    allowNull: false,
    defaultValue: "bookmarked",
  },
  dateApplied: {
    type: Sequelize.DATE,
  },
  description: {
    type: Sequelize.STRING,
  },
});
module.exports = Job;
