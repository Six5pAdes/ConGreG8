import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getReviews,
  getOneReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getOneReview);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
