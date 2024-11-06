const Job = require("../models/jobModel");

const userJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const isJobAssociatedWithUser = await Job.findOne({
      where: {
        userId: req.user.id,
        id: jobId,
      },
    });
    if (!isJobAssociatedWithUser) {
      return res.status(500).json({ success: false, message: `job not found` });
    }
    req.jobId = jobId;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `something went wrong while verification:${error}`,
    });
  }
};
module.exports = userJob;
