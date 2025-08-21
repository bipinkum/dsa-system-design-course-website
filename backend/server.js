import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./src/auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Magic Link Backend is running");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
