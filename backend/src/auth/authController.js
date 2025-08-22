import { generateToken, verifyToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import { config } from "../../config.js";

export const sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !config.paidUsers.includes(email)) {
      return res.status(400).json({ error: "Invalid or unregistered email" });
    }

    const token = generateToken({ email });
    const magicLink = `${config.serverUrl}/auth/verify?token=${token}`;

    await sendEmail(email, "Your Magic Login Link", `Click here to login: ${magicLink}`);
    res.json({ message: "Magic link sent to email!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending magic link" });
  }
};

export const verifyMagicLink = (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Token required");

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).send("Invalid or expired token");

    // Redirect to main website courses page with token
    res.redirect(`https://bipinkumar.me/courses?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
};
