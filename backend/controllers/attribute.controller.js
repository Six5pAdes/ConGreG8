import mongoose from "mongoose";
import ChurchAttribute from "../models/attribute.model.js";

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
    const churchAttr = await ChurchAttribute.findById(id);
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
  const churchAttr = req.body;

  if (req.user.userType === "churchgoer") {
    return res.status(403).json({
      success: false,
      message:
        "This is for church representatives to describe what their church provides for its congregants.",
    });
  }

  try {
    churchAttr.churchId = req.church._id;

    const newChurchAttr = new ChurchAttribute(churchAttr);
    await newChurchAttr.save();

    res.status(201).json({ success: true, data: newChurchAttr });
  } catch (error) {
    console.error("Error in creating churchAttr: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
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

  if (
    !existingChurchAttr.userId ||
    existingChurchAttr.userId.toString() !== req.user._id.toString()
  ) {
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
