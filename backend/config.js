import dotenv from "dotenv";
dotenv.config();

export const config = {
  serverUrl: process.env.SERVER_URL || "https://dsa-system-design-course-website.onrender.com",
  clientUrl: process.env.CLIENT_URL || "https://bipinkumar.me",
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  paidUsers: process.env.PAID_USERS ? process.env.PAID_USERS.split(",") : []
};
