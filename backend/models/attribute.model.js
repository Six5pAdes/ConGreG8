import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Church",
    },
    size: { type: Number, required: true },
    ageGroup: {
      type: String,
      enum: ["family", "youngAdult", "adult", "senior"],
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
    },
    serving: { type: Boolean, default: "no" },
    serviceTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    serviceNumber: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false, // to remove __v field
  }
);

export default mongoose.model("ChurchAttribute", attributeSchema);
