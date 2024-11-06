const Job = require("../models/jobModel");
const Note = require("../models/noteModel");

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: {
        jobId: req.jobId,
      },
    });
    return res.status(200).json({ success: true, notes: notes });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.getNote = async (req, res) => {};
exports.postNote = async (req, res) => {
  try {
    const noteBody = {
      ...req.body,
      jobId: req.jobId,
    };
    const note = await Note.create(noteBody);
    return res.status(201).json({ success: true, note: note });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong: ${error}`,
    });
  }
};
exports.putNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const noteBody = req.body;
    const note = await Note.update(noteBody, {
      where: {
        id: noteId,
      },
    });
    return res.status(200).json({ success: true, note: note });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    await Note.destroy({
      where: {
        id: noteId,
      },
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Something went wrong: ${error}` });
  }
};
