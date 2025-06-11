import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Church",
    },
    size: {
      type: String,
      enum: [
        "small", // 25-200
        "midsize", // 200-400
        "big", // 400-2000
        "megachurch", // 2000+
      ],
      null: true,
    },
    ageGroup: {
      type: String,
      enum: ["family", "youngAdult", "adult", "senior"],
      null: true,
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
      null: true,
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
      null: true,
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
      null: true,
    },
    serviceNumber: { type: Number, null: true },
    serviceTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      null: true,
    },
    volunteering: { type: Boolean, default: "no" },
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

export default mongoose.model("ChurchAttribute", attributeSchema);
