import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getUserPrefs,
  getSingleUserPref,
  createUserPref,
  updateUserPref,
  deleteUserPref,
} from "../controllers/userPref.controller.js";

const router = express.Router();

router.get("/", getUserPrefs);
router.get("/:id", protect, getSingleUserPref);
router.post("/", protect, createUserPref);
router.put("/:id", protect, updateUserPref);
router.delete("/:id", protect, deleteUserPref);

export default router;
