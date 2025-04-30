import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.model('Review', reviewSchema);
