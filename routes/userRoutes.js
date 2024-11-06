const router = require("express").Router();
const { updateProfile, getProfile } = require("../controllers/userController");

router.put("/", updateProfile);
router.get("/", getProfile);

module.exports = router;
