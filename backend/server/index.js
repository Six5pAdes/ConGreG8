import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "../config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { notFound, errorHandler } from "../middleware/errorMiddleware.js";
import userRoutes from "../routes/user.route.js";
import churchRoutes from "../routes/church.route.js";
import reviewRoutes from "../routes/review.route.js";
import userPrefRoutes from "../routes/userPref.route.js";
import attributeRoutes from "../routes/attribute.route.js";
import volunteerRoutes from "../routes/volunteer.route.js";
import savedChurchRoutes from "../routes/saved.route.js";

dotenv.config();
// console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/churches", churchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user-prefs", userPrefRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/volunteering", volunteerRoutes);
app.use("/api/saved", savedChurchRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running at http://localhost:" + PORT);
});
