// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/connectDB.js";
import authRouter from "./routes/authUser.js"
import messageRouter from "./routes/messageRoute.js"
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js"

// const app = express();
import { app, server } from "./socket/socket.js";
import path from "path";

const __dirname = path.resolve();

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// app.get("/", (req, res) => {
//     res.send("Express server is running");
// });

app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)
app.use('/api/user', userRouter)

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
