const cron = require("node-cron");
const { Op } = require("sequelize");
const Reminder = require("../models/reminderModel"); // Adjust path as needed
const { sendEmail } = require("./sendgrid"); // Adjust path as needed

const startCronJob = () => {
  // Schedule a cron job to run every day at midnight (0 0 * * *)
  cron.schedule("0 0 * * *", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of day

    // Find all reminders that should be sent today
    const reminders = await Reminder.findAll({
      where: {
        date: {
          [Op.gte]: today,
          [Op.lte]: endOfDay,
        },
      },
    });

    // Send all reminders for today
    for (const reminder of reminders) {
      await sendEmail(
        "akansari4u143@gmail.com",
        "sendgrid testing",
        reminder.content
      );
      await reminder.destroy(); // Optionally delete the reminder
    }
  });
};

module.exports = startCronJob; // Correct export statement
