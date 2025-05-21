import mongoose from "mongoose";
import UserPreference from "../models/userPref.model.js";

export const getUserPrefs = async (req, res) => {
  try {
    const userPrefs = await UserPreference.find({});
    res.status(200).json({ success: true, data: userPrefs });
  } catch (error) {
    console.log("Error in fetching user preferences:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSingleUserPref = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid User Preference Id" });
  }

  try {
    const userPref = await UserPreference.findById(id);
    if (!userPref) {
      return res
        .status(404)
        .json({ success: false, message: "User Preference not found" });
    }
    res.status(200).json({ success: true, data: userPref });
  } catch (error) {
    console.error("Error fetching userPref:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createUserPref = async (req, res) => {
  const userPref = req.body;

  if (req.user.userType === "churchRep") {
    return res.status(403).json({
      success: false,
      message:
        "This is for churchgoers to describe what they're looking for in a church.",
    });
  }

  try {
    userPref.userId = req.user._id;

    const newUserPref = new UserPreference(userPref);
    await newUserPref.save();

    res.status(201).json({ success: true, data: newUserPref });
  } catch (error) {
    console.error("Error in creating userPref: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUserPref = async (req, res) => {
  const { id } = req.params;
  const userPref = req.body;

  if (req.user.userType === "churchRep") {
    return res.status(403).json({
      success: false,
      message:
        "Only churchgoers can update what they're looking for in a church.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid User Preference Id" });
  }

  const existingUserPref = await UserPreference.findById(id);
  if (!existingUserPref) {
    return res
      .status(404)
      .json({ success: false, message: "User Preference not found" });
  }

  if (
    !existingUserPref.userId ||
    existingUserPref.userId.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this user's preferences",
    });
  }

  try {
    const updatedUserPref = await UserPreference.findByIdAndUpdate(
      id,
      userPref,
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, data: updatedUserPref });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// export const deleteUserPref = async (req, res) => {
//   const { id } = req.params;

//   if (req.user.userType === "churchRep") {
//     return res.status(403).json({
//       success: false,
//       message: "Only churchgoers can delete their preferences.",
//     });
//   }

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Invalid User Preference Id" });
//   }

//   try {
//     const userPrefToDelete = await UserPref.findById(id);
//     if (!userPrefToDelete) {
//       return res
//         .status(404)
//         .json({ success: false, message: "UserPref not found" });
//     }

//     if (
//       !userPrefToDelete.userId ||
//       userPrefToDelete.userId.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to delete this user preference(s)",
//       });
//     }

//     await UserPref.findByIdAndDelete(id);

//     res.status(200).json({ success: true, message: "UserPref deleted" });
//   } catch (error) {
//     console.log("error in deleting userPref:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
