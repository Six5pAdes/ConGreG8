import mongoose from "mongoose";
import VolunteerOpportunity from "../models/volunteer.model.js";

export const getVolunteerOps = async (req, res) => {
  try {
    const reviews = await VolunteerOpportunity.find({});
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log("Error in fetching volunteer ops:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getVolunteerOpsByChurch = async (req, res) => {
  const { churchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(churchId)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Id" });
  }

  try {
    const volunteerOps = await VolunteerOpportunity.find({ churchId });
    res.status(200).json({ success: true, data: volunteerOps });
  } catch (error) {
    console.log(
      "Error in fetching church's volunteer opportunities:",
      error.message
    );
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOneVolunteerOp = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Volunteer Op Id" });
  }

  try {
    const volunteerOp = await VolunteerOpportunity.findById(id);
    if (!volunteerOp) {
      return res
        .status(404)
        .json({ success: false, message: "Volunteer Op not found" });
    }
    res.status(200).json({ success: true, data: volunteerOp });
  } catch (error) {
    console.error("Error fetching volunteerOp:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createVolunteerOp = async (req, res) => {
  const volunteerOp = req.body;

  if (req.user.userType === "churchgoer") {
    return res.status(403).json({
      success: false,
      message:
        "Only church representatives can list its church's volunteer opportunities.",
    });
  }

  if (
    !volunteerOp.title ||
    !volunteerOp.description ||
    !volunteerOp.isActive ||
    !volunteerOp.isMember
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields must be filled in." });
  }

  if (!volunteerOp.churchId) {
    return res.status(400).json({
      success: false,
      message: "Church ID is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(volunteerOp.churchId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Church ID",
    });
  }

  try {
    volunteerOp.churchId = req.church._id;

    const newVolunteerOp = new ChurchAttribute(volunteerOp);
    await newVolunteerOp.save();

    res.status(201).json({ success: true, data: newVolunteerOp });
  } catch (error) {
    console.error("Error in creating volunteerOp: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateVolunteerOp = async (req, res) => {
  const { id } = req.params;
  const volunteerOp = req.body;

  if (req.user.userType === "churchgoer") {
    return res.status(403).json({
      success: false,
      message:
        "Only church reps can update their church's volunteer opportunities.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Volunteer Opportunity Id" });
  }

  const existingVolunteerOp = await VolunteerOpportunity.findById(id);
  if (!existingVolunteerOp) {
    return res
      .status(404)
      .json({ success: false, message: "Volunteer Opportunity not found" });
  }

  if (
    !existingVolunteerOp.userId ||
    existingVolunteerOp.userId.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this volunteer op",
    });
  }

  if (
    !volunteerOp.title ||
    !volunteerOp.description ||
    !volunteerOp.isActive ||
    !volunteerOp.isMember
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields must be filled in." });
  }

  try {
    const updatedVolunteerOp = await VolunteerOpportunity.findByIdAndUpdate(
      id,
      volunteerOp,
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: updatedVolunteerOp });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteVolunteerOp = async (req, res) => {
  const { id } = req.params;

  if (req.user.userType === "churchgoer") {
    return res.status(403).json({
      success: false,
      message:
        "Only church reps can delete their church's volunteer opportunities.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Volunteer Opportunity Id" });
  }

  try {
    const volunteerOpToDelete = await VolunteerOpportunity.findById(id);
    if (!volunteerOpToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Volunteer Opportunity not found" });
    }

    if (
      !volunteerOpToDelete.userId ||
      volunteerOpToDelete.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this volunteer opportunity",
      });
    }

    await VolunteerOpportunity.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Volunteer Opportunity deleted" });
  } catch (error) {
    console.log("error in deleting review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
