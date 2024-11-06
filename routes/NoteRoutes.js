const {
  getNote,
  postNote,
  putNote,
  deleteNote,
  getNotes,
} = require("../controllers/NoteController");

const router = require("express").Router();

router.get("/all", getNotes);
router.get("/", getNote);
router.post("/", postNote);
router.put("/:noteId", putNote);
router.delete("/:noteId", deleteNote);

module.exports = router;
