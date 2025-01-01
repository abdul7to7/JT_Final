const Sequelize = require("sequelize");
const sequelize = require("../utils/db");

const Note = sequelize.define("jt_note", {
  content: {
    type: Sequelize.STRING,
    nullAllowed: false,
  },
});

module.exports = Note;
