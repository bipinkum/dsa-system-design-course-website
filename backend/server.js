import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/auth/authRoutes.js";
import { verifyToken } from "./src/utils/jwt.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Middleware
app.use(
  cors({
    origin: ["https://bipinkumar.me", "https://courses.bipinkumar.me"], // frontend domains
    credentials: true, // allow cookies
  })
);

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);

// ✅ Protected API for student courses
app.get("/api/student-courses", (req, res) => {
  // Read JWT from HTTP-only cookie
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Example course list
    const courses = [
      {
        name: "DSA Course",
        videoUrl: "https://d2akmzsrq67og8.cloudfront.net/DSA/video1759923415.mp4",
      },
      {
        name: "System Design Course",
        videoUrl: "https://d2akmzsrq67og8.cloudfront.net/DSA/video1759923415.mp4",
      },
    ];

    res.json({ courses });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Magic Link Backend Running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
