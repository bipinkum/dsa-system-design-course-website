import express from "express";
import path from "path"; 
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import { Signer } from "aws-sdk/clients/cloudfront";

import authRoutes from "./src/auth/authRoutes.js";
import { verifyToken } from "./src/utils/jwt.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Read CloudFront Private Key
const privateKeyPath = path.resolve(process.env.PRIVATE_KEY_PATH);
const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;

// ✅ Helper to generate signed CloudFront URL
function getSignedUrl(url) {
  const signer = new Signer(keyPairId, privateKey);
  const expires = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
  return signer.getSignedUrl({ url, expires });
}

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

// Serve static frontend files
app.use(express.static(path.join(path.resolve(), "public")));

// Auth routes
app.use("/auth", authRoutes);

// ✅ Protected API for student courses
app.get("/api/student-courses", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Not authenticated" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Courses with signed CloudFront URLs
    const courses = [
      {
        name: "DSA Course",
        videoUrl: getSignedUrl("https://d2akmzsrq67og8.cloudfront.net/DSA/video1.mp4"),
      },
      {
        name: "System Design Course",
        videoUrl: getSignedUrl("https://d2akmzsrq67og8.cloudfront.net/DSA/video2.mp4"),
      },
    ];

    res.json({ courses });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// ✅ Serve courses page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "courses.html"));
});
app.get("/courses", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "courses.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
