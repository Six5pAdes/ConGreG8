import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import Church from "../models/church.model.js";
import UserPreference from "../models/userPref.model.js";
import Review from "../models/review.model.js";
import SavedChurch from "../models/saved.model.js";
import ChurchAttribute from "../models/attribute.model.js";
import VolunteerOpportunity from "../models/volunteer.model.js";

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    if (user.userType === "churchgoer") {
      res.json({
        success: true,
        data: {
          _id: user._id,
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
        },
      });
    } else if (user.userType === "churchRep") {
      res.json({
        success: true,
        data: {
          _id: user._id,
          userType: user.userType,
          churchName: user.churchName,
          email: user.email,
        },
      });
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming user ID is stored in req.user after authentication

  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.userType === "churchgoer") {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } else if (user.userType === "churchRep") {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        userType: user.userType,
        churchName: user.churchName,
        email: user.email,
      },
    });
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const {
    userType,
    firstName,
    lastName,
    username,
    churchName,
    email,
    password,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Validate required fields based on user type
  if (userType === "churchgoer") {
    if (!firstName || !lastName || !username || !email) {
      res.status(400);
      throw new Error("Please provide all required fields for churchgoers");
    }
  } else if (userType === "churchRep") {
    if (!churchName || !email) {
      res.status(400);
      throw new Error("Please provide church name for church representatives");
    }
  }

  const user = await User.create({
    userType,
    firstName,
    lastName,
    username,
    churchName,
    email,
    password,
  });

  if (user && userType === "churchgoer") {
    generateToken(res, user._id);
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } else if (user && userType === "churchRep") {
    generateToken(res, user._id);
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        userType: user.userType,
        churchName: user.churchName,
        email: user.email,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
};

export const getUserProfile = asyncHandler(async (req, res) => {
  // If ID is provided in params, get that user's profile
  // Otherwise, get the authenticated user's profile
  const userId = req.params.id || req.user._id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.userType === "churchgoer") {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } else if (user.userType === "churchRep") {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        userType: user.userType,
        churchName: user.churchName,
        email: user.email,
      },
    });
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user._id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.email = req.body.email || user.email;
  user.username = req.body.username || user.username;
  user.churchName = req.body.churchName || user.churchName;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  if (user.userType === "churchgoer") {
    generateToken(res, updatedUser._id);
    res.status(201).json({
      success: true,
      data: {
        _id: updatedUser._id,
        userType: updatedUser.userType,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } else if (user.userType === "churchRep") {
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        userType: updatedUser.userType,
        churchName: updatedUser.churchName,
        email: updatedUser.email,
      },
    });
  }
});

export const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user._id;
  const user = await User.findById(userId).select("-password");

  if (user) {
    if (user.userType === "churchgoer") {
      // Delete all user preferences
      await UserPreference.deleteMany({ userId: user._id });
      // Delete all reviews
      await Review.deleteMany({ userId: user._id });
      // Delete all saved churches
      await SavedChurch.deleteMany({ userId: user._id });
    } else if (user.userType === "churchRep") {
      // Find all churches created by this user
      const churches = await Church.find({ userId: user._id });
      for (const church of churches) {
        // Delete all attributes for this church
        await ChurchAttribute.deleteMany({ churchId: church._id });
        // Delete all volunteer opportunities for this church
        await VolunteerOpportunity.deleteMany({ churchId: church._id });
        // Delete the church itself
        await Church.findByIdAndDelete(church._id);
      }
    }
    // Delete the user
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "User and associated data removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});
