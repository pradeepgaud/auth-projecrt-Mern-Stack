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

// Allowed origins (local + vercel)
const allowedOrigins = ["http://localhost:5173"];

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS CONFIG (PRODUCTION SAFE)
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      // allow localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow ALL vercel domains
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight (IMPORTANT)
app.options("*", cors());

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
