import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/auth/authRoutes.js";
import { verifyToken } from "./src/utils/jwt.js";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read private key from env path
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");
const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
const distributionDomain = process.env.CLOUDFRONT_DOMAIN; // e.g. d12345.cloudfront.net

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

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRoutes);

// ✅ Protected API for student courses
app.get("/api/student-courses", async (req, res) => {
  const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });

    // Example courses (file paths inside CloudFront)
    const coursesList = [
      { name: "DSA Course", path: "DSA/video1759923415.mp4" },
      { name: "System Design Course", path: "DSA/video1759923415.mp4" },
    ];

    // Generate signed URLs dynamically
    const courses = coursesList.map(course => {
      const signedUrl = getSignedUrl({
        url: `https://${distributionDomain}/${course.path}`,
        keyPairId,
        privateKey,
        dateLessThan: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
      });
      return { name: course.name, videoUrl: signedUrl };
    });

    res.json({ courses });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Serve courses page
app.get(["/", "/courses"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "courses.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
