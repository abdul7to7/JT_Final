const File = require("../models/fileModel");
const Job = require("../models/jobModel");
const Note = require("../models/noteModel");
const Reminder = require("../models/reminderModel");
const { Op } = require("sequelize");

exports.getJobs = async (req, res) => {
  try {
    const { status, startDate, endDate, salary, keyword } = req.query;
    let where = {
      userId: req.user.id,
    };
    if (status && status != "all") where.status = status;
    if (salary) {
      where.maxSalary = {
        [Op.gte]: salary,
      };
    }
    if (startDate && endDate) {
      where.dateApplied = {
        [Op.gte]: new Date(startDate),
        [Op.lte]: new Date(endDate),
      };
    }
    if (keyword) {
      where[Op.or] = [
        { position: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { company: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const jobs = await Job.findAll({
      where,
    });
    return res.status(201).json({ success: true, jobs: jobs });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.getJob = async (req, res) => {
  try {
    const jobDetails = await Job.findByPk(req.params.jobId, {
      include: [Note, Reminder, File],
    });
    return res.status(201).json({ success: true, jobDetails: jobDetails });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.postJob = async (req, res) => {
  try {
    const jobBody = {
      ...req.body,
      userId: req.user.id,
    };
    console.log(req.body);
    const job = await Job.create(jobBody);
    return res.status(201).json({ success: true, job: job });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.putJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const jobBody = req.body;
    console.log(jobBody);
    await Job.update(jobBody, {
      where: {
        id: jobId,
      },
    });
    const updatedJob = await Job.findOne({ where: { id: jobId } });
    return res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const file = await File.findOne({ where: { jobId } });

    // If the file exists, delete it from S3
    if (file && file.filePath) {
      await deleteFileFromS3(file.filePath);

      // Optionally, delete the file record from the database
      await file.destroy();
    }
    await Job.destroy({
      where: {
        id: jobId,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
