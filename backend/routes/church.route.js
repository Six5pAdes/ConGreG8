import express from "express";

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
router.post("/", createChurch);
router.put("/:id", updateChurch);
router.delete("/:id", deleteChurch);

export default router;
