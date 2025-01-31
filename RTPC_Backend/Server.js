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
import ACTIONS from "./Actions.js";
import "dotenv/config";
import codeRoutes from "./routes/codeSaveRoute.js";
import dockerode from "dockerode";
import adminRouter from "./routes/adminRoute.js";

mongoose
  .connect("mongodb+srv://giddearyan222:umcaa2025@pym-db.nwazx.mongodb.net/?retryWrites=true&w=majority&appName=pym-db")
  .then(() => console.log("MONGO DB CONNECTED"));


const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = 5000;


app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/user", userRouter);
app.use("/students", studentRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/members", membersRoutes);
app.use("/api", codeRoutes);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.end("API Working");
});


const docker = new dockerode();


const languageConfig = {
  python: { versionIndex: "1" },
  java: { versionIndex: "3" },
  cpp: { versionIndex: "4" },
  php: { versionIndex: "3" },
  c: { versionIndex: "4" },
  javascript: { versionIndex: "1" },
};


app.post("/api/execute", async (req, res) => {
  const { code, language } = req.body;
  console.log(language)

  if (!code || !language) {
    return res.status(400).json({ error: "Code or language not provided" });
  }

  let imageName = "node";
  let cmd = ["node", "-e", code];

  switch (language) {
    case "python3":
      imageName = "python";
      cmd = ["python", "-c", code];
      break;
    case "cpp":
      imageName = "gcc";
      cmd = [
        "bash",
        "-c",
        `echo '${code}' > program.cpp && g++ program.cpp -o program && ./program`,
      ];
      break;

    case "java":
      imageName = "openjdk:11";
      const classNameMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = classNameMatch ? classNameMatch[1] : "Main";

      cmd = [
        "bash",
        "-c",
        `echo "${code.replace(
          /"/g,
          '\\"'
        )}" > ${className}.java && javac ${className}.java && java ${className}`,
      ];
      break;
    case "c":
      imageName = "gcc";
      cmd = [
        "bash",
        "-c",
        `echo "${code.replace(
          /"/g,
          '\\"'
        )}" > program.c && gcc program.c -o program && ./program`,
      ];
      break;
    case "javascript":
    case "js":
      imageName = "node";
      cmd = ["node", "-e", code];
      break;
    case "php":
      imageName = "php:8.0-cli";

      const sanitizedCode = code
        .replace(/\r\n/g, "\n")
        .replace(/"/g, '\\"')
        .replace(/\$/g, "\\$");

      cmd = [
        "bash",
        "-c",
        `echo "${sanitizedCode}" > /script.php && php /script.php`,
      ];
      break;

    default:
      return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    console.log(`Creating Docker container for ${imageName}...`);
    const container = await docker.createContainer({
      Image: imageName,
      Cmd: cmd,
      Tty: false,
      MemLimit: 1000000000,
      CpuShares: 512,
      Volumes: {
        "/tmp": {},
      },
      HostConfig: {
        Binds: ["./tmp:/tmp"],
      },
    });

    console.log("Starting Docker container...");
    await container.start();

    console.log("Fetching logs from Docker container...");
    const logs = await new Promise((resolve, reject) => {
      container.logs(
        {
          stdout: true,
          stderr: true,
          follow: true,
          tail: 1000,
        },
        (err, stream) => {
          if (err) {
            reject(err);
          }
          let output = "";
          stream.on("data", (chunk) => {
            output += chunk.toString("utf8");
          });
          stream.on("end", () => {
            resolve(cleanDockerOutput(output));
          });
        }
      );
    });

    console.log("Logs from Docker container:", logs);

    if (logs) {
      res.json({ output: logs });
    } else {
      res.status(500).json({ error: "No output from the container" });
    }

    const containerStatus = await container.inspect();
    if (containerStatus.State.Running) {
      console.log("Stopping Docker container...");
      await container.stop();
    }

    console.log("Cleaning up Docker container...");
    await container.remove();
  } catch (error) {
    console.error("Error during Docker execution:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Failed to execute code", details: error.message });
    }
  }
});

function cleanDockerOutput(output) {
  return output.replace(/[\x00-\x1F\x7F]/g, "").trim();
}


const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
};
export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);


  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });


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

    console.log(`${username} joined room: ${roomId}`);
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

export { app, io, server };

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});