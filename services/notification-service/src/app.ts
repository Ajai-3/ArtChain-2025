import express from "express";
import notificationRoutes from "./presentation/routes/notification.routes"

const app = express()


app.use("/api/v1/notifications", notificationRoutes)

export default app;