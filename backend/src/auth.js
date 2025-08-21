import express from "express";
import jwt from "jsonwebtoken";
import { sendMail } from "./mailer.js";
import { JWT_SECRET, FRONTEND_URL } from "./config.js";

const router = express.Router();

// Temporary whitelist of allowed users
const allowedUsers = ["bipinmit@gmail.com", "student1@gmail.com"];

router.post("/send-magic-link", async (req, res) => {
  const { email } = req.body;

  if (!allowedUsers.includes(email)) {
    return res.status(403).json({ error: "❌ Email not registered for the course" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
  const magicLink = `${FRONTEND_URL}/verify.html?token=${token}`;

  await sendMail(
    email,
    "Your Magic Link",
    `Click this link: ${magicLink}`,
    `<p>Click <a href="${magicLink}">here</a> to login. Expires in 5 minutes.</p>`
  );

  res.json({ message: "✅ Magic link sent to your inbox" });
});

router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, email: decoded.email });
  } catch {
    res.status(401).json({ valid: false, error: "Invalid or expired token" });
  }
});

export default router;
