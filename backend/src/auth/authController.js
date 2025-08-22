import { generateToken, verifyToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import { config } from "../../config.js";

export const sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Only allow paid users
    if (!config.paidUsers.includes(email)) {
      return res.status(401).json({ error: "Email not authorized" });
    }

    const token = generateToken({ email });

    // Send magic link to the courses domain
    const magicLink = `${config.clientCoursesUrl}?token=${token}`;

    await sendEmail(email, "Your Magic Login Link", `Click here to login: ${magicLink}`);

    return res.json({ message: "Magic link sent to email!" });
  } catch (error) {
    console.error("Error in sendMagicLink:", error);
    res.status(500).json({ error: "Error sending magic link" });
  }
};

export const verifyMagicLink = (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Token required");

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).send("Invalid or expired token");

    // Redirect to courses frontend without token in final URL
    const redirectUrl = `${config.clientCoursesUrl}/courses?token=${token}`;
    res.redirect(redirectUrl);

  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
};
