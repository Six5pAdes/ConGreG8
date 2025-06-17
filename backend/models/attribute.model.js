import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
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
    size: {
      type: [
        {
          type: String,
          enum: [
            "small", // 25-200
            "midsize", // 200-400
            "big", // 400-2000
            "megachurch", // 2000+
          ],
        },
      ],
      default: [],
    },
    ageGroup: {
      type: [
        {
          type: String,
          enum: ["family", "youngAdult", "adult", "senior"],
        },
      ],
      default: [],
    },
    ethnicity: {
      type: [
        {
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
      ],
      default: [],
    },
    language: {
      type: [
        {
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
      ],
      default: [],
    },
    denomination: {
      type: [
        {
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
      ],
      default: [],
    },
    serviceNumber: {
      type: Number,
      default: null,
    },
    serviceTime: {
      type: [
        {
          type: String,
          enum: ["morning", "afternoon", "evening"],
        },
      ],
      default: [],
    },
    volunteering: {
      type: Boolean,
      default: false,
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

export default mongoose.model("ChurchAttribute", attributeSchema);
