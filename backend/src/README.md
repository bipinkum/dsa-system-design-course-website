# Magic Link Backend

This is the backend for Magic Link Authentication (for bipinkumar.me).

## 🚀 Deploy on Render

1. Push this `backend/` folder to a **GitHub repo**.
2. Go to [Render](https://render.com/).
3. Create a new **Web Service** → Connect your GitHub repo.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables in Render:
   - `PORT=10000`
   - `JWT_SECRET=supersecretkey`
   - `FRONTEND_URL=https://bipinkumar.me`
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=your-email@gmail.com`
   - `SMTP_PASS=your-app-password`

Render will give you a public URL like:  
`https://magic-link-backend.onrender.com`

Now update your frontend (in `verify.html`) to call this backend instead of `localhost`.
