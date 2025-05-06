import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Church', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
    isMember: { type: Boolean, default: false },
    isVolunteer: { type: Boolean, default: false },
}, {
    timestamps: true
});

export default mongoose.model('ServiceOpportunity', serviceSchema);
