import dotenv from "dotenv";
dotenv.config();

export const config = {
  serverUrl: process.env.SERVER_URL,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  jwtSecret: process.env.JWT_SECRET,
  paidUsers: process.env.PAID_USERS ? process.env.PAID_USERS.split(",") : []
};
