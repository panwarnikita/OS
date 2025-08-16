import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
