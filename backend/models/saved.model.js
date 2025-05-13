import mongoose from "mongoose";

const savedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Church",
    },
  },
  {
    timestamps: true,
    versionKey: false, // to remove __v field
  }
);

export default mongoose.model("SavedChurch", savedSchema);
