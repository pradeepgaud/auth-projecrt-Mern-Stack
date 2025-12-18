import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/Mongodb.js";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

const app = express();
const port = process.env.PORT || 4000;      

// Connect DB
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS CONFIG (SINGLE & CORRECT)
// Backend CORS में explicitly add करें
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://auth-projecrt-mern-stack.vercel.app",
        "https://auth-projecrt-mern-stack.vercel.app/",
        // और भी Vercel preview URLs
      ];
      
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// Routes
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
