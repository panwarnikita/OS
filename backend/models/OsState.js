import mongoose from "mongoose";

const osStateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    layout: { type: Object, default: {} } // window positions, sizes, open apps
  },
  { timestamps: true }
);

export default mongoose.model("OsState", osStateSchema);
