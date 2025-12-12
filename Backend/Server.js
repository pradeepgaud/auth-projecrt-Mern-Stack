import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/Mongodb.js";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
  "https://auth-projecrt-mern-stack-qkudlvi9c-pradeep-gauds-projects.vercel.app",
  "http://localhost:5173",
];

app.use(express.json());
app.use(cookieParser());

// ⭐ CORS Fix (NO WILDCARDS!)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("CORS Not Allowed: " + origin));
    },
    credentials: true,
  })
);

// ⭐ IMPORTANT: REMOVE THIS (this causes crash)
// app.options("*", cors());

// ⭐ Express v5 compatible OPTIONS handler
app.options("/", cors());
app.options("/api/*", cors());

app.get("/", (req, res) => {
  res.send("Backend Connected Successfully!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ⭐ Safe fallback route (Express v5)
app.use((req, res) => {
  res.status(404).send("Route Not Found");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
