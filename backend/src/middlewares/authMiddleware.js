import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) return res.status(401).json({ error: "Invalid token" });

  req.user = decoded;
  next();
};
