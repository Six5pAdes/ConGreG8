import express from "express";

import { createChurch, deleteChurch, getChurches, updateChurch } from "../controllers/church.controller.js";

const router = express.Router();

router.get("/", getChurches);
router.post("/", createChurch);
router.put("/:id", updateChurch);
router.delete("/:id", deleteChurch);

export default router;
