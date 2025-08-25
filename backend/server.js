import express from "express";
import path from "path"; 
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/auth/authRoutes.js";
import { verifyToken } from "./src/utils/jwt.js";

// AWS CloudFront signing
import { CloudFrontSigner } from "@aws-sdk/cloudfront-signer";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your CloudFront details
const CF_DOMAIN = "d2akmzsrq67og8.cloudfront.net"; // CloudFront domain
const PRIVATE_KEY_PATH = "./keys/cloudfront-private-key.pem"; // PEM file path
const KEY_PAIR_ID = "YOUR_KEY_PAIR_ID"; // Key Pair ID from CloudFront

// Initialize CloudFront Signer
const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
const signer = new CloudFrontSigner({
  keyPairId: KEY_PAIR_ID,
  privateKey
});

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

// Serve static files from public/
app.use(express.static(path.join(path.resolve(), "public")));

// Routes
app.use("/auth", authRoutes);

// ✅ Protected API for student courses
app.get("/api/student-courses", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Not authenticated" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Example course data with CloudFront paths
    const coursesData = [
      { name: "DSA Course", path: "DSA/video1759923415.mp4" },
      { name: "System Design Course", path: "DSA/video1759923415.mp4" }
    ];

    // Generate signed URLs valid for 1 hour
    const courses = coursesData.map(course => {
      const signedUrl = signer.getSignedUrl({
        url: `https://${CF_DOMAIN}/${course.path}`,
        expires: Math.floor((Date.now() + 60 * 60 * 1000) / 1000), // 1 hour expiry in seconds
      });
      return { name: course.name, videoUrl: signedUrl };
    });

    res.json({ courses });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// ✅ Serve courses.html when hitting /courses
app.get("/courses", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "courses.html"));
});

// Optional: redirect root to /courses
app.get("/", (req, res) => {
  res.redirect("/courses");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
