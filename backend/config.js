import dotenv from "dotenv";
dotenv.config();

export const config = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  serverUrl: process.env.SERVER_URL || "http://localhost:4001",
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  paidUsers: process.env.PAID_USERS ? process.env.PAID_USERS.split(",") : [], // CSV of emails
};
