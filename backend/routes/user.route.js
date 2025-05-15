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

router.route("/").get(getAllUsers).post(registerUser);
router.post("/login", authUser);
router.delete("/logout", logoutUser);

// Add route for getting a specific user's profile
router.get("/current", protect, getCurrentUser);
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);
router.delete("/:id", protect, deleteUserProfile);

export default router;
