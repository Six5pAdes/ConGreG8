import mongoose from "mongoose";

const savedSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
}, {
    timestamps: true
});

export default mongoose.model('SavedChurch', savedSchema);
