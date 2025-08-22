import jwt from "jsonwebtoken";
import { config } from "../../config.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "15m" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
};
