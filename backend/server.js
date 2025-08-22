import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/auth/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Serve frontend static pages
app.use(express.static(path.join(__dirname, "../frontend"))); // <-- frontend folder

// Routes
app.use("/auth", authRoutes);

// API for student courses
app.get("/api/student-courses", (req, res) => {
  const userEmail = req.cookies.userEmail;
  if (!userEmail) return res.status(401).json({ error: "Not logged in" });

  const courses = [
    { name: "DSA Course", videoUrl: "https://your-cloudfront/video1.mp4" },
    { name: "System Design Course", videoUrl: "https://your-cloudfront/video2.mp4" },
  ];

  res.json({ courses });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
