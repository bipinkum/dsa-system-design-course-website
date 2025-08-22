import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/auth/authRoutes.js";
import { verifyToken } from "./src/utils/jwt.js"; // ✅ static import

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Middleware (must be before routes)
app.use(cors({
  origin: "https://bipinkumar.me",  // your frontend domain
  credentials: true
}));

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);

// API for student courses
app.get("/api/student-courses", (req, res) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Example course list
    const courses = [
      { name: "DSA Course", videoUrl: "https://your-cloudfront/video1.mp4" },
      { name: "System Design Course", videoUrl: "https://your-cloudfront/video2.mp4" }
    ];

    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching courses" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Magic Link Backend Running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
