import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getSaved,
  addSaved,
  deleteSaved,
} from "../controllers/saved.controller.js";

const router = express.Router();

router.get("/", protect, getSaved);
router.post("/", protect, addSaved);
router.delete("/:id", protect, deleteSaved);

export default router;
