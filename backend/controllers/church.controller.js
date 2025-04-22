import mongoose from "mongoose";
import Church from "../models/church.model.js";

export const getChurches = async (req, res) => {
    try {
        const churches = await Church.find({});
        res.status(200).json({ success: true, data: churches });
    } catch (error) {
        console.log("error in fetching churches:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createChurch = async (req, res) => {
    const church = req.body;

    if (!church.name || !church.address || !church.city || !church.state || !church.phone || !church.email || !church.website) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newChurch = new Church(church);

    try {
        await newChurch.save();
        res.status(201).json({ success: true, data: newChurch });
    } catch (error) {
        console.error("Error in Creating Church:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateChurch = async (req, res) => {
    const { id } = req.params;

    const church = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Church Id" });
    }

    if (!church.name || !church.address || !church.city || !church.state || !church.phone || !church.email || !church.website) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const updatedChurch = await Church.findByIdAndUpdate(id, church, { new: true });
        res.status(200).json({ success: true, data: updatedChurch });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteChurch = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Church Id" });
    }

    try {
        await Church.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Church deleted" });
    } catch (error) {
        console.log("error in deleting church:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
