const express = require("express");
require("dotenv").config();
const sequelize = require("./utils/db");
const User = require("./models/userModel");
const Job = require("./models/jobModel");
const File = require("./models/fileModel");
const Reminder = require("./models/reminderModel");
const Note = require("./models/noteModel");
const app = express();
const cors = require("cors");
const reminderCron = require("./utils/cronJobs");

app.use(
  cors({
    origin: ["https://jt-final.vercel.app"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

User.hasMany(Job, { onDelete: "CASCADE" });
Job.belongsTo(User);
Job.hasMany(File, { onDelete: "CASCADE" });
File.belongsTo(Job);
Job.hasMany(Reminder, { onDelete: "CASCADE" });
Reminder.belongsTo(Job);
Job.hasMany(Note, { onDelete: "CASCADE" });
Note.belongsTo(Job);

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const authenticate = require("./middlewares/authVerifyToken");
const noteRoutes = require("./routes/NoteRoutes");
const userJob = require("./middlewares/jobVerification");
const reminderRoutes = require("./routes/ReminderRoutes");
const fileRoutes = require("./routes/fileRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/auth", authRoutes);
app.use("/job", authenticate, jobRoutes);
app.use("/note/:jobId", authenticate, userJob, noteRoutes);
app.use("/reminder/:jobId", authenticate, userJob, reminderRoutes);
app.use("/file/:jobId", authenticate, userJob, fileRoutes);
app.use("/user", authenticate, userRoutes);

sequelize
  // .sync({ force: true })
  //   .sync({ alter: true })
  .sync()
  .then(() => {
    reminderCron();
    app.listen(process.env.PORT || 3000);
  })
  .then(() => {
    console.log("server is running");
  });
