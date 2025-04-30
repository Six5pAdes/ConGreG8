import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
    imageUrl: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.model('ChurchImage', imageSchema);
