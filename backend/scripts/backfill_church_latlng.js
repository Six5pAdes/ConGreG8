// Data backfill script for church latitude and longitude
// Usage: node backend/scripts/backfill_church_latlng.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import axios from "axios";
import Church from "../models/church.model.js";
import { connectDB } from "../config/db.js"; // Assumes this connects to MongoDB

async function geocodeAddress(address, city, state) {
  const query = `${address}, ${city}, ${state}`;
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
          "User-Agent":
            "congreg8-backfill-script/1.0 (austinhall6smusic@gmail.com)",
        },
      }
    );
    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      };
    }
    return null;
  } catch (err) {
    console.error(`Geocoding error for ${query}:`, err.message);
    return null;
  }
}

async function backfillChurchLatLng() {
  await connectDB();

  const query = {
    $or: [
      { latitude: { $exists: false } },
      { longitude: { $exists: false } },
      { latitude: null },
      { longitude: null },
    ],
  };
  const churches = await Church.find(query);
  console.log(`Found ${churches.length} churches missing lat/lng.`);
  let updated = 0;
  for (const church of churches) {
    const { address, city, state } = church;
    if (!address || !city || !state) {
      console.warn(`Skipping church with missing address info: ${church._id}`);
      continue;
    }
    const coords = await geocodeAddress(address, city, state);
    if (coords) {
      church.latitude = coords.latitude;
      church.longitude = coords.longitude;
      await church.save();
      updated++;
      console.log(`Updated ${church.name} (${church._id}) with lat/lng.`);
    } else {
      console.warn(`Could not geocode: ${church.name} (${church._id})`);
    }
    // Be polite to the API
    await new Promise((r) => setTimeout(r, 1100));
  }
  console.log(`Backfill complete. Updated ${updated} churches.`);
  mongoose.connection.close();
}

backfillChurchLatLng();
