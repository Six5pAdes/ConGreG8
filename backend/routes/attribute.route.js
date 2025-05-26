import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getChurchAttrs,
  getSingleChurchAttr,
  createChurchAttr,
  updateChurchAttr,
  deleteChurchAttr,
} from "../controllers/attribute.controller.js";

const router = express.Router();

router.get("/", getChurchAttrs);
router.get("/:id", protect, getSingleChurchAttr);
router.post("/", protect, createChurchAttr);
router.put("/:id", protect, updateChurchAttr);
router.delete("/:id", protect, deleteChurchAttr);

export default router;
