import mongoose from "mongoose";
import SavedChurch from "../models/saved.model.js";

export const getSaved = async (req, res) => {
  try {
    const saved = await SavedChurch.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    console.log("Error in fetching saved churches:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSavedByUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    const saved = await SavedChurch.find({ userId: id });
    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    console.log("Error in fetching user saved church(es):", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addSaved = async (req, res) => {
  const saved = req.body;

  if (req.user.userType === "churchRep") {
    return res
      .status(403)
      .json({ success: false, message: "Only churchgoers can save churches" });
  }

  if (!saved.churchId) {
    return res.status(400).json({
      success: false,
      message: "Church ID is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(saved.churchId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Church ID",
    });
  }

  try {
    // Check if church is already saved by this user
    const existingSave = await SavedChurch.findOne({
      userId: req.user._id,
      churchId: saved.churchId,
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: "Church is already saved",
      });
    }

    saved.userId = req.user._id;

    const newSave = new SavedChurch(saved);
    await newSave.save();

    res.status(201).json({ success: true, data: newSave });
  } catch (error) {
    console.error("Error in creating saved church: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteSaved = async (req, res) => {
  const { id } = req.params;

  if (req.user.userType === "churchRep") {
    return res.status(403).json({
      success: false,
      message: "Only churchgoers can unsave a church",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Saved Church Id" });
  }

  try {
    const savedToDelete = await SavedChurch.findById(id);
    if (!savedToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Saved Church not found" });
    }

    if (
      !savedToDelete.userId ||
      savedToDelete.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to unsave this church",
      });
    }

    await SavedChurch.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Saved Church deleted" });
  } catch (error) {
    console.log("error in deleting saved church:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
