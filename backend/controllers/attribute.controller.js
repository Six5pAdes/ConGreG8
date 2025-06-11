import mongoose from "mongoose";
import ChurchAttribute from "../models/attribute.model.js";
import Church from "../models/church.model.js";

export const getChurchAttrs = async (req, res) => {
  try {
    const churchAttrs = await ChurchAttribute.find({});
    res.status(200).json({ success: true, data: churchAttrs });
  } catch (error) {
    console.log("Error in fetching church attributes:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSingleChurchAttr = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Attribute Id" });
  }

  try {
    const churchAttr = await ChurchAttribute.find({ churchId: id });
    if (!churchAttr) {
      return res
        .status(404)
        .json({ success: false, message: "Church Attribute not found" });
    }
    res.status(200).json({ success: true, data: churchAttr });
  } catch (error) {
    console.error("Error fetching churchAttr:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createChurchAttr = async (req, res) => {
  try {
    const churchAttr = req.body;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.userType === "churchgoer") {
      return res.status(403).json({
        success: false,
        message:
          "This is for church representatives to describe what their church provides for its congregants.",
      });
    }

    if (!churchAttr.churchId) {
      return res.status(400).json({
        success: false,
        message: "Church ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(churchAttr.churchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Church ID",
      });
    }

    // Verify that the church belongs to the user
    const church = await Church.findById(churchAttr.churchId);
    if (!church) {
      return res.status(404).json({
        success: false,
        message: "Church not found",
      });
    }

    if (church.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add attributes to this church",
      });
    }

    // Add userId to the attributes
    churchAttr.userId = req.user._id;

    const newChurchAttr = new ChurchAttribute(churchAttr);
    await newChurchAttr.save();

    res.status(201).json({ success: true, data: newChurchAttr });
  } catch (error) {
    console.error("Error in creating churchAttr:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateChurchAttr = async (req, res) => {
  const { id } = req.params;
  const churchAttr = req.body;

  if (req.user.userType === "churchgoer") {
    return res.status(403).json({
      success: false,
      message: "Only church reps can update their church's attributes.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Attribute Id" });
  }

  const existingChurchAttr = await ChurchAttribute.findById(id);
  if (!existingChurchAttr) {
    return res
      .status(404)
      .json({ success: false, message: "Church Attribute not found" });
  }

  // Verify that the church belongs to the user
  const church = await Church.findById(existingChurchAttr.churchId);
  if (!church) {
    return res.status(404).json({
      success: false,
      message: "Associated church not found",
    });
  }

  if (church.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this church's attributes",
    });
  }

  try {
    const updatedChurchAttr = await ChurchAttribute.findByIdAndUpdate(
      id,
      churchAttr,
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: updatedChurchAttr });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteChurchAttr = async (req, res) => {
  const { id } = req.params;

  if (req.user.userType === "churchgoer") {
    return res.status(403).json({
      success: false,
      message: "Only church reps can delete their church's attributes.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Attribute Id" });
  }

  try {
    const churchAttrToDelete = await ChurchAttribute.findById(id);
    if (!churchAttrToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Church Attributes not found" });
    }

    // Verify that the church belongs to the user
    const church = await Church.findById(churchAttrToDelete.churchId);
    if (!church) {
      return res.status(404).json({
        success: false,
        message: "Associated church not found",
      });
    }

    if (church.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this church's attributes",
      });
    }

    await ChurchAttribute.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Church Attributes deleted" });
  } catch (error) {
    console.error("Error in deleting church attributes:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
