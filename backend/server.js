import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

import authRoutes from "./src/auth/authRoutes.js";
import { verifyToken } from "./src/utils/jwt.js";
import AWS from "aws-sdk";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AWS CloudFront config
const cloudfront = new AWS.CloudFront.Signer(
  process.env.CLOUDFRONT_KEY_PAIR_ID, 
  fs.readFileSync(process.env.PRIVATE_KEY_PATH)
);
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

// ✅ CORS Middleware
app.use(
  cors({
    origin: ["https://bipinkumar.me", "https://courses.bipinkumar.me"],
    credentials: true,
  })
);

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));
app.use("/courses", express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRoutes);

// Generate signed URL
function getSignedUrl(pathKey) {
  const url = `https://${CLOUDFRONT_DOMAIN}/${pathKey}`;
  const expires = Math.floor((Date.now() + 5 * 60 * 1000) / 1000); // 5 minutes
  return cloudfront.getSignedUrl({
    url,
    expires,
  });
}

// ✅ API for student courses
app.get("/api/student-courses", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Not authenticated" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Example course metadata
    const coursesMeta = [
      { name: "DSA Course", pathKey: "DSA/video1759923415.mp4" },
      { name: "System Design Course", pathKey: "SystemDesign/video1.mp4" },
    ];

    // Generate signed URLs dynamically
    const courses = coursesMeta.map(course => ({
      name: course.name,
      videoUrl: getSignedUrl(course.pathKey)
    }));

    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Serve frontend pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "courses.html")));
app.get("/courses", (req, res) => res.sendFile(path.join(__dirname, "public", "courses.html")));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
