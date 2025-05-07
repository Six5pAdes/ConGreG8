import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Church",
      required: true,
    },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
    versionKey: false, // to remove __v field
  }
);

export default mongoose.model("Review", reviewSchema);
