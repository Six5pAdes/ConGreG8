import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
    serviceType: { type: String, required: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
}, {
    timestamps: true
});

export default mongoose.model('ServiceOpportunity', serviceSchema);
