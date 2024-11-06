const {
  getFile,
  postFile,
  deleteFile,
  getFiles,
} = require("../controllers/fileController");
const fileUpload = require("../middlewares/fileOperations");

const router = require("express").Router();

router.get("/all", getFiles);
router.get("/:fileId", getFile);
router.post("/upload", fileUpload.single("file"), postFile);
router.delete("/:fileKey", deleteFile);

module.exports = router;
