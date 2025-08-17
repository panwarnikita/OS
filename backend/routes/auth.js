// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import { requireAuth } from "../middleware/auth.js";

// const router = express.Router();

// // register
// // register
// router.post("/register", async (req, res) => {
//   try {
//     const { email, password, name = "" } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "Missing email or password" });
//     }

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: "User already exists" });

//     // schema will hash password automatically
//     const user = new User({ email, password, name });
//     await user.save();

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ token, user: { id: user._id, email, name: user.name } });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });


// // login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// });

// router.get("/me", requireAuth, async (req, res) => {
//   res.json({ userId: req.userId });
// });

// export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name = "" } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, email, name: user.name } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Me
router.get("/me", requireAuth, async (req, res) => {
  res.json({ userId: req.userId });
});

export default router;
