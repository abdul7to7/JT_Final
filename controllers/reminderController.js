const Job = require("../models/jobModel");
const Reminder = require("../models/reminderModel");

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: {
        jobId: req.jobId,
      },
    });
    return res.status(200).json({ success: true, reminders: reminders });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.getReminder = async (req, res) => {};
exports.postReminder = async (req, res) => {
  try {
    const reminderBody = {
      ...req.body,
      jobId: req.jobId,
    };
    const reminder = await Reminder.create(reminderBody);
    return res.status(201).json({ success: true, reminder: reminder });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.putReminder = async (req, res) => {
  try {
    const reminderId = req.params.reminderId;
    const reminderBody = req.body;
    const reminder = await Reminder.update(reminderBody, {
      where: {
        id: reminderId,
        jobId: req.jobId,
      },
    });
    return res.status(200).json({ success: true, reminder: reminder });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.deleteReminder = async (req, res) => {
  try {
    const reminderId = req.params.reminderId;
    await Reminder.destroy({
      where: {
        id: reminderId,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
