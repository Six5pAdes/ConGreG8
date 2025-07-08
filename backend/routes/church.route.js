import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import axios from "axios";

import {
  createChurch,
  deleteChurch,
  getChurches,
  getOneChurch,
  updateChurch,
} from "../controllers/church.controller.js";

const router = express.Router();

router.get("/", getChurches);
router.post("/geocode", async (req, res) => {
  const { address, city, state, zipcode } = req.body;
  if (!address || !city || !state) {
    return res
      .status(400)
      .json({ success: false, message: "Missing address, city, or state." });
  }
  let query = `${address}, ${city}, ${state}`;
  if (zipcode) query += `, ${zipcode}`;
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "congreg8-backend/1.0 (austinhall6smusic@gmail.com)",
        },
      }
    );
    if (response.data && response.data.length > 0) {
      return res.json({
        success: true,
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Address not found." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Geocoding error", error: err.message });
  }
});
router.get("/:id", getOneChurch);
router.post("/", protect, createChurch);
router.put("/:id", protect, updateChurch);
router.delete("/:id", protect, deleteChurch);

export default router;
