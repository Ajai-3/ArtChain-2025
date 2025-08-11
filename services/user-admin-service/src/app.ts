import express from "express";
const app = express()


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.get("/api/v1/user/health", (req, res) => {
    console.log("haii")
    return res.send("hello")
})

export default app;