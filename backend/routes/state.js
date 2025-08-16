import express from "express";
import { requireAuth } from "../middleware/auth.js";
import OsState from "../models/OsState.js";

const router = express.Router();

// get layout
router.get("/", requireAuth, async (req, res) => {
  const doc = await OsState.findOne({ userId: req.userId });
  res.json(doc?.layout || {});
});

// save/replace layout
router.put("/", requireAuth, async (req, res) => {
  const layout = req.body || {};
  const doc = await OsState.findOneAndUpdate(
    { userId: req.userId },
    { layout },
    { new: true, upsert: true }
  );
  res.json(doc.layout);
});

export default router;
