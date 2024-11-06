const {
  getJob,
  postJob,
  putJob,
  deleteJob,
  getJobs,
} = require("../controllers/jobController");

const router = require("express").Router();

router.get("/all", getJobs);
router.get("/:jobId", getJob);
router.post("/", postJob);
router.put("/:jobId", putJob);
router.delete("/:jobId", deleteJob);

module.exports = router;
