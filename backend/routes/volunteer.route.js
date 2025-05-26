import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getVolunteerOps,
  getVolunteerOpsByChurch,
  getOneVolunteerOp,
  createVolunteerOp,
  updateVolunteerOp,
  deleteVolunteerOp,
} from "../controllers/volunteer.controller.js";

const router = express.Router();

// Public routes
router.get("/", getVolunteerOps);
router.get("/churches/:churchId", getVolunteerOpsByChurch);
router.get("/:id", getOneVolunteerOp);

// Protected routes
router.post("/", protect, createVolunteerOp);
router.put("/:id", protect, updateVolunteerOp);
router.delete("/:id", protect, deleteVolunteerOp);

export default router;
