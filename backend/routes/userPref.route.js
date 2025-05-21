import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getUserPrefs,
  getSingleUserPref,
  createUserPref,
  updateUserPref,
} from "../controllers/userPref.controller.js";

const router = express.Router();

router.get("/", protect, getUserPrefs);
router.get("/:id", protect, getSingleUserPref);
router.post("/", protect, createUserPref);
router.put("/:id", protect, updateUserPref);

export default router;
