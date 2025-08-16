import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name = "" } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email, name } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid creds" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid creds" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ userId: req.userId });
});

export default router;
