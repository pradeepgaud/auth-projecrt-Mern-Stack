import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/Mongodb.js";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// Connect Database
connectDB();

// ⭐ Allowed Frontend URLs
const allowedOrigins = [
  "https://auth-projecrt-mern-stack-qkudlvi9c-pradeep-gauds-projects.vercel.app",
  "http://localhost:5173",
];

// ⭐ Middlewares
app.use(express.json());
app.use(cookieParser());

// ⭐ Stable CORS Configuration (Best for Render + Vercel)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, server-side, and non-browser requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ⭐ Fix for Preflight OPTIONS Error
app.options("*", cors());

// ⭐ Root Route
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully!");
});

// ⭐ API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ⭐ Express v5 Safe Fallback Route (Fix for "*" crash)
app.use((req, res) => {
  res.status(404).send("Route Not Found");
});

// ⭐ Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
