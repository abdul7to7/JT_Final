const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const File = sequelize.define("file", {
  name: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  type: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  url: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
  key: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
});

module.exports = File;
