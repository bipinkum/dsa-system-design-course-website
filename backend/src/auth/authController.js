import { generateToken, verifyToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import { config } from "../../config.js";

export const sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received email:", email);

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Check if email is paid
    if (!config.paidUsers.includes(email)) {
      console.log("Email not in paid users list:", email);
      return res.status(401).json({ error: "Email not authorized" });
    }

    const token = generateToken({ email });
    const magicLink = `${config.clientUrl}?token=${token}`;
    console.log("Generated magic link:", magicLink);

    await sendEmail(email, "Your Magic Login Link", `Click here to login: ${magicLink}`);
    console.log("Email sent successfully");

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

    // ✅ Set HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // ✅ Redirect to frontend courses page without token in URL
    res.redirect("https://bipinkumar.me/courses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
};

