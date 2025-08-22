import express from "express";
import path from "path"; 
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/auth/authRoutes.js";
import { verifyToken } from "./src/utils/jwt.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files from public/
app.use(express.static(path.join(path.resolve(), "public")));

// Routes
app.use("/auth", authRoutes);

// ✅ Protected API for student courses
app.get("/api/student-courses", (req, res) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Not authenticated" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Example courses
    const courses = [
      { name: "DSA Course", videoUrl: "https://d2akmzsrq67og8.cloudfront.net/DSA/video1759923415.mp4" },
      { name: "System Design Course", videoUrl: "https://d2akmzsrq67og8.cloudfront.net/DSA/video1759923415.mp4" }
    ];

    res.json({ courses });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});


// ✅ Serve courses.html when hitting root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "courses.html"));
});

// ✅ Optionally also serve /courses
app.get("/courses", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "courses.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
