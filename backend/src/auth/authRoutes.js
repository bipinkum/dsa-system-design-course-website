import express from "express";
import { sendMagicLink, verifyMagicLink } from "./authController.js";

const router = express.Router();

// 🔹 Send magic link to email
router.post("/login", async (req, res) => {
  try {
    await sendMagicLink(req, res);
  } catch (err) {
    console.error("Error sending magic link:", err);
    res.status(500).json({ error: "Failed to send magic link" });
  }
});

// 🔹 Verify magic link and return JWT
router.get("/verify", async (req, res) => {
  try {
    await verifyMagicLink(req, res);
  } catch (err) {
    console.error("Error verifying magic link:", err);
    res.status(500).json({ error: "Failed to verify magic link" });
  }
});

export default router;
