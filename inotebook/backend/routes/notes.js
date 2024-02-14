const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route 1 : get all the notes using GET : "/api/auth/fetchallnotes"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  console.log("sa");
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
  // obj={
  //     a:'thiso',
  //     number:34
  // }
  // res.json(obj);
  // res.json([]);
});
//Route 2 : add  the notes using POST : "/api/auth/addnotes"
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Plsease enter unique value", message: error.message });
    }
  }
);
//Route 3 : edit  the notes using PUT : "/api/auth/updatenotes"
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //create new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // find note to beupdated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    ); //it new not are comming then record is created
    //if there are return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    }

    const updateNote = await note.updateOne();
    res.json(updateNote);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Plsease enter unique value", message: error.message });
  }
});
//Route 3 : delete  the notes using DELETE : "/api/auth/deletenotes"
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    // find note to beupdated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    //Allow deletion is user owns this
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);

    //   const updateNote = await note.updateOne();
    res.json({ Success: "Notes has been deleted", note: note });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Plsease enter unique value", message: error.message });
  }
});
module.exports = router;
