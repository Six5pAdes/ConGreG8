import mongoose from "mongoose";

const churchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String, required: true }
}, {
    timestamps: true // in lieu of createdAt and updatedAt
});

export default mongoose.model('Church', churchSchema);
