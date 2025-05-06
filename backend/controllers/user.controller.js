import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    if (user.isChurchgoer) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else if (!user.isChurchgoer) {
      res.json({
        _id: user._id,
        churchName: user.churchName,
        email: user.email,
      });
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export const registerUser = asyncHandler(async (req, res) => {
  const {
    isChurchgoer,
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
  if (isChurchgoer) {
    if (!firstName || !lastName || !username || !email) {
      res.status(400);
      throw new Error("Please provide all required fields for churchgoers");
    }
  } else {
    if (!churchName || !email) {
      res.status(400);
      throw new Error("Please provide church name for church representatives");
    }
  }

  const user = await User.create({
    isChurchgoer,
    firstName,
    lastName,
    username,
    churchName,
    email,
    password,
  });

  if (user && isChurchgoer) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    });
  } else if (user && !isChurchgoer) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      churchName: user.churchName,
      email: user.email,
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

  if (user.isChurchgoer) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    });
  } else if (!user.isChurchgoer) {
    res.json({
      _id: user._id,
      churchName: user.churchName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user._id;

  const user = await User.findById(userId).select("-password");

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.churchName = req.body.churchName || user.churchName;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    if (user.isChurchgoer) {
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } else if (!user.isChurchgoer) {
      res.json({
        _id: updatedUser._id,
        churchName: updatedUser.churchName,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
});

export const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user._id;
  const user = await User.findById(userId).select("-password");

  if (user) {
    await User.findByIdAndDelete(user);
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});
