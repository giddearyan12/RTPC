import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import messageRoutes from './routes/messageRoute.js';
import membersRoutes from './routes/membersRoute.js';
import cookieParser from "cookie-parser";
import studentRouter from './routes/studentRoute.js';
import { Server } from "socket.io";
import http from "http";
import ACTIONS from "./Actions.js"; // Ensure you have an Actions.js file
import axios from "axios";
import 'dotenv/config';

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/RTPC')
  .then(() => console.log('MONGO DB CONNECTED'));

// Initialize Express App
const app = express();
const server = http.createServer(app); // Wrap the app in an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', userRouter);
app.use('/students', studentRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/members", membersRoutes);

// Root Route
app.get('/', (req, res) => {
  res.end("API Working");
});

// Language Configuration for Code Compilation
const languageConfig = {
  python3: { versionIndex: "3" },
  java: { versionIndex: "3" },
  cpp: { versionIndex: "4" },
  php: { versionIndex: "3" },
  c: { versionIndex: "4" },
};

// Code Compilation Route
app.post("/compile", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language: language,
      versionIndex: languageConfig[language].versionIndex,
      clientId: 'edea8ed67d8b30091eb1de199c5fe97',
      clientSecret: 'f3105127cddbdad6a8da3609cfd69c4014067d87590fe5b54f486652f346b59b',
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compile code" });
  }
});

// Socket.io Logic
const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
};

io.on("connection", (socket) => {

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
