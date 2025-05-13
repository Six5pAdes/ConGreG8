import mongoose from "mongoose";

const churchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    description: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    website: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true, // in lieu of createdAt and updatedAt
    versionKey: false, // to remove __v field
  }
);

export default mongoose.model("Church", churchSchema);
