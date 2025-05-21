import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Church",
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isMember: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false, // to remove __v field
  }
);

export default mongoose.model("VolunteerOpportunity", volunteerSchema);
