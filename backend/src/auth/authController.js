import { sendEmail } from "../utils/email.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { config } from "../../config.js";

export const sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    if (!config.paidUsers.includes(email)) return res.status(403).json({ error: "Not enrolled" });

    const token = generateToken({ email });
    const link = `${config.serverUrl}/auth/verify?token=${token}`;

    await sendEmail(email, "Your Magic Login Link", `Click here to login: ${link}`);
    res.json({ message: "Magic link sent! Check your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send magic link" });
  }
};

export const verifyMagicLink = (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Token required");

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).send("Invalid or expired link");

    // Set cookie for session
    res.cookie("userEmail", decoded.email, { httpOnly: true, maxAge: 24 * 3600 * 1000 });
    res.redirect("/student-dashboard.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
};
