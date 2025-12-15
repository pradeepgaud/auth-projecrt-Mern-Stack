// // import express from "express";
// // import cors from "cors";
// // import "dotenv/config";
// // import cookieParser from "cookie-parser";
// // import connectDB from "./Config/Mongodb.js";
// // import authRouter from "./Routes/AuthRoutes.js";
// // import userRouter from "./Routes/UserRoutes.js";

// // const app = express();
// // const port = process.env.PORT || 4000;
// // connectDB();

// // const allowedOrigins = ["http://localhost:5173"];

// // app.use(express.json());
// // app.use(cookieParser());
// // app.use(cors({ origin: allowedOrigins, credentials: true }));

// // // api  endpoints

// // app.get("/", (req, res) => {
// //   res.send("Hello Server");
// // });
// // app.use("/api/auth", authRouter);
// // app.use("/api/user", userRouter);
// // // app.use(cors({ credentials: true }));
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173",
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //   })
// // );

// // app.listen(port, () => {
// //   console.log(`Server is running at http://localhost:${port}`);
// // });

// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";
// import connectDB from "./Config/Mongodb.js";
// import authRouter from "./Routes/AuthRoutes.js";
// import userRouter from "./Routes/UserRoutes.js";

// const app = express();
// const port = process.env.PORT || 4000;
// connectDB();

// const allowedOrigins = ["http://localhost:5173"];

// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // API Routes
// app.get("/", (req, res) => {
//   res.send("Hello Server");
// });

// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/Mongodb.js";
import authRouter from "./Routes/AuthRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// DB
connectDB();

// ALLOWED FRONTEND ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-auth-anqn0pez8-pradeep-gauds-projects.vercel.app/",
];

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

// ROUTES
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

