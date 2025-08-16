import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import stateRoutes from "./routes/state.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// db connect
mongoose
  .connect(process.env.MONGO_URI, { dbName: "os_hackathon" })
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.error("Mongo error:", e.message));

// routes
app.get("/", (req, res) => res.send("API OK"));
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/state", stateRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running on port", port));
