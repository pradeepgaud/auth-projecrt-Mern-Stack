import express from "express";
import userAuth from "../Middleware/UserAuth.js";
import { getUserData } from "../Controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);

export default userRouter;
