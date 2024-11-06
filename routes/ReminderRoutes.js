const {
  getReminder,
  postReminder,
  putReminder,
  deleteReminder,
  getReminders,
} = require("../controllers/reminderController");

const router = require("express").Router();

router.get("/all", getReminders);
router.get("/", getReminder);
router.post("/", postReminder);
router.put("/:reminderId", putReminder);
router.delete("/:reminderId", deleteReminder);

module.exports = router;
