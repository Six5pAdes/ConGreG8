import mongoose from "mongoose";
import Review from "../models/review.model.js";

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("userId", "firstName lastName")
      .populate("churchId", "name address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log("Error in fetching reviews:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getReviewsByUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    const reviews = await Review.find({ userId: id })
      .populate("userId", "firstName lastName")
      .populate("churchId", "name address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log("Error in fetching user's reviews:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getReviewsByChurch = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Id" });
  }

  try {
    const reviews = await Review.find({ churchId: id })
      .populate("userId", "firstName lastName")
      .populate("churchId", "name address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log("Error in fetching church's reviews:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOneReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Review Id" });
  }

  try {
    const review = await Review.findById(id)
      .populate("userId", "firstName lastName")
      .populate("churchId", "name address");
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error("Error fetching review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createReview = async (req, res) => {
  const review = req.body;

  if (req.user.userType === "churchRep") {
    return res
      .status(403)
      .json({ success: false, message: "Only churchgoers can leave reviews" });
  }

  if (!review.rating || review.rating < 1 || review.rating > 5) {
    return res.status(400).json({
      success: false,
      message: "A rating between 1 and 5 stars is required",
    });
  }

  if (!review.churchId) {
    return res.status(400).json({
      success: false,
      message: "Church ID is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(review.churchId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Church ID",
    });
  }

  try {
    review.userId = req.user._id;

    const newReview = new Review(review);
    await newReview.save();

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error("Error in creating review: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const review = req.body;

  if (req.user.userType === "churchRep") {
    return res.status(403).json({
      success: false,
      message: "Only churchgoers can update their reviews",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Review Id" });
  }

  const existingReview = await Review.findById(id);
  if (!existingReview) {
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  }

  if (
    !existingReview.userId ||
    existingReview.userId._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this review",
    });
  }

  if (!review.rating || review.rating < 1 || review.rating > 5) {
    return res.status(400).json({
      success: false,
      message: "A rating between 1 and 5 stars is required",
    });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(id, review, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (req.user.userType === "churchRep") {
    return res.status(403).json({
      success: false,
      message: "Only churchgoers can delete their reviews",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Review Id" });
  }

  try {
    const reviewToDelete = await Review.findById(id);
    if (!reviewToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Check if userId is populated (object with _id) or just ObjectId
    const reviewUserId = reviewToDelete.userId._id
      ? reviewToDelete.userId._id.toString()
      : reviewToDelete.userId.toString();
    const currentUserId = req.user._id.toString();

    if (reviewUserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.log("error in deleting review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
