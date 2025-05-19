import express from "express";
import {
  authUser,
  getCurrentUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.route("/").get(getAllUsers).post(registerUser);
router.post("/login", authUser);
router.delete("/logout", logoutUser);

// Protected routes - specific routes first
router.get("/current", protect, getCurrentUser);

// Protected routes - parameterized routes last
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);
router.delete("/:id", protect, deleteUserProfile);

export default router;
