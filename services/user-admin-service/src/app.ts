import express from "express";
import cookieParser from 'cookie-parser';

import authRouter from "./presentation/routes/user/auth.routes";
import userRouter from "./presentation/routes/user/user.routes";
import adminRouter from "./presentation/routes/admin/admin.routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);


export default app;