import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    size: {
      type: String,
      enum: [
        "small", // 25-200
        "midsize", // 200-400
        "big", // 400-2000
        "megachurch", // 2000+
      ],
    },
    ageGroup: {
      type: String,
      enum: ["family", "youngAdult", "adult", "senior"],
    },
    ethnicity: {
      type: String,
      enum: [
        "africanAmerican",
        "asian",
        "caucasian",
        "hispanic",
        "pacificIslander",
        "other",
      ],
    },
    language: {
      type: String,
      enum: [
        "english",
        "spanish",
        "french",
        "german",
        "mandarin",
        "korean",
        "other",
      ],
    },
    denomination: {
      type: String,
      enum: [
        "baptist",
        "catholic",
        "evangelical",
        "lutheran",
        "methodist",
        "orthodox",
        "pentecostal",
        "presbyterian",
        "non-denominational",
      ],
    },
    volunteering: { type: Boolean, default: false },
    serviceNumber: { type: Number },
    serviceTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
    },
    participatory: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false, // to remove __v field
  }
);

export default mongoose.model("UserPreference", userPreferenceSchema);
