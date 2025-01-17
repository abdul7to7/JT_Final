const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const Reminder = sequelize.define("jt_reminder", {
  content: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  date: {
    type: Sequelize.DATE,
    nullAllowed: false,
  },
});

module.exports = Reminder;
