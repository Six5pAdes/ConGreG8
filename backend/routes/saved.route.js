import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getSaved,
  getSingleSaved,
  getSavedByUser,
  addSaved,
  deleteSaved,
} from "../controllers/saved.controller.js";

const router = express.Router();

router.get("/", protect, getSaved);
router.get("/:id", protect, getSingleSaved);
router.get("/user/:id", protect, getSavedByUser);
router.post("/", protect, addSaved);
router.delete("/:id", protect, deleteSaved);

export default router;
