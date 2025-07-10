import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Church",
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String },
  },
  {
    timestamps: true,
    versionKey: false, // to remove __v field
  }
);

// Automatically populate user data on find
reviewSchema.pre("find", function () {
  this.populate("userId", "firstName lastName");
});

reviewSchema.pre("findOne", function () {
  this.populate("userId", "firstName lastName");
});

reviewSchema.pre("findById", function () {
  this.populate("userId", "firstName lastName");
});

export default mongoose.model("Review", reviewSchema);
