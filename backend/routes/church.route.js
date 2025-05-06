import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createChurch,
  deleteChurch,
  getChurches,
  getOneChurch,
  updateChurch,
} from "../controllers/church.controller.js";

const router = express.Router();

router.get("/", getChurches);
router.get("/:id", getOneChurch);
router.post("/", protect, createChurch);
router.put("/:id", protect, updateChurch);
router.delete("/:id", protect, deleteChurch);

export default router;
