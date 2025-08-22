import express from "express";
import { sendMagicLink, verifyMagicLink } from "./authController.js";

const router = express.Router();

router.post("/login", sendMagicLink);
router.get("/verify", verifyMagicLink);

export default router;
