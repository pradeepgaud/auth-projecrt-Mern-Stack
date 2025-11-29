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

// Connect Database
connectDB();

// ALLOWED FRONTEND URL (Vercel)
const allowedOrigins = [
  "https://auth-projecrt-mern-stack-e6bsof409-pradeep-gauds-projects.vercel.app",
  "http://localhost:5173",
];

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// CORS SETTINGS    
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully!");
});

// API ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// START SERVER
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
