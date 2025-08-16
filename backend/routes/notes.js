import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Note from "../models/Note.js";

const router = express.Router();

// list
router.get("/", requireAuth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 });
  res.json(notes);
});

// create
router.post("/", requireAuth, async (req, res) => {
  const { title = "", content = "" } = req.body;
  const note = await Note.create({ userId: req.userId, title, content });
  res.json(note);
});

// update
router.put("/:id", requireAuth, async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title, content },
    { new: true }
  );
  res.json(note);
});

// delete
router.delete("/:id", requireAuth, async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

export default router;
