import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getChurchAttrs,
  getSingleChurchAttr,
  createChurchAttr,
  updateChurchAttr,
} from "../controllers/attribute.controller.js";

const router = express.Router();

router.get("/", getChurchAttrs);
router.get("/:id", getSingleChurchAttr);
router.post("/", protect, createChurchAttr);
router.put("/:id", protect, updateChurchAttr);

export default router;
