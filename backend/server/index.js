import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from '../middleware/errorMiddleware.js';
import userRoutes from '../routes/user.route.js';
import churchRoutes from '../routes/church.route.js';

dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/churches", churchRoutes);

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
    console.log('Server is running at http://localhost:' + PORT);
})
