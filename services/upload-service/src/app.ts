import express from "express";

const app = express()

import uploadRoutes from "./presentation/routes/upload.routes"

app.use(express.json());
app.use("/upload", uploadRoutes)

export default app;