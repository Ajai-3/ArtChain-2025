import http from "http";
import app from "./app";


const PORT = 3001

const server = http.createServer(app)


server.listen(PORT, () => {
    console.log(`User Admin Service starts on port ${PORT}`)
})