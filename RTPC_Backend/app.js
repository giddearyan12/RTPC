import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import membersRoutes from "./routes/membersRoute.js";
import cookieParser from "cookie-parser";
import studentRouter from "./routes/studentRoute.js";
import { Server } from "socket.io";
import http from "http";

import "dotenv/config";
import codeRoutes from "./routes/codeSaveRoute.js";

import adminRouter from "./routes/adminRoute.js";
import codeExecutionRoutes from "./routes/codeExecutionRoute.js";


import { socketHandler } from "./socketExecution.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MONGO DB CONNECTED"));


const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/students", studentRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/members", membersRoutes);
app.use("/api", codeRoutes);
app.use("/admin", adminRouter);
app.use("/api", codeExecutionRoutes);


io.on("connection", (socket) => {
  socketHandler(socket, io);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { server, io };
