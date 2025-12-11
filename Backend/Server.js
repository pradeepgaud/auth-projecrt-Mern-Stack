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

// ⭐ Add your correct Vercel frontend URL here
const allowedOrigins = [
  "https://auth-projecrt-mern-stack-qkudlvi9c-pradeep-gauds-projects.vercel.app",
  "http://localhost:5173",
];

app.use(express.json());
app.use(cookieParser());

// ⭐ Stable CORS Configuration (Best for Render + Vercel)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman & server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ⭐ Fix preflight failure (OPTIONS request)
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Backend Connected Successfully!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
