import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/auth/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);

// API for student courses
app.get("/api/student-courses", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    const { verifyToken } = await import("./src/utils/jwt.js");
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid token" });

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

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
